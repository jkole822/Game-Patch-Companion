import { sources, users } from "@db/schema";
import { rolePermissionConflictSchema } from "@shared/schemas";
import {
  sourceConflictSchema,
  sourceNotFoundConflictSchema,
  sourceResponseSchema,
} from "@shared/schemas";
import { eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { sourceUpdateInputSchema } from "@shared/schemas";
import type { z } from "zod";

type UpdateSourceInput = z.infer<typeof sourceUpdateInputSchema>;
type UpdateSourceSuccess = z.infer<typeof sourceResponseSchema>;
type UpdateSourceConflict = z.infer<typeof sourceConflictSchema>;
type UpdateSourceNotFoundConflict = z.infer<typeof sourceNotFoundConflictSchema>;
type UpdateRolePermissionConflict = z.infer<typeof rolePermissionConflictSchema>;

type UpdateSourceResult =
  | { ok: true; data: UpdateSourceSuccess }
  | { ok: false; error: UpdateSourceConflict }
  | { ok: false; error: UpdateSourceNotFoundConflict }
  | { ok: false; error: UpdateRolePermissionConflict };

export const updateSource = async ({
  db,
  sourceId,
  user,
  ...input
}: UpdateSourceInput & {
  db: AppDb;
  sourceId: string;
  user: JwtUser;
}): Promise<UpdateSourceResult> => {
  try {
    const [authUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

    if (!authUser) {
      throw new Error("User not found");
    }

    if (authUser.role !== "admin") {
      return {
        ok: false,
        error: rolePermissionConflictSchema.parse({
          error: "NO_PERMISSION_FOR_ROLE",
          message: "You do not have permission to update sources.",
        }),
      };
    }

    const [updatedSource] = await db
      .update(sources)
      .set(input)
      .where(eq(sources.id, sourceId))
      .returning({
        baseUrl: sources.baseUrl,
        config: sources.config,
        createdAt: sources.createdAt,
        id: sources.id,
        isEnabled: sources.isEnabled,
        key: sources.key,
        name: sources.name,
        type: sources.type,
      });

    if (!updatedSource) {
      return {
        ok: false,
        error: sourceNotFoundConflictSchema.parse({
          error: "SOURCE_NOT_FOUND",
          message: "Source not found.",
        }),
      };
    }

    return {
      ok: true,
      data: sourceResponseSchema.parse(updatedSource),
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return {
        ok: false,
        error: sourceConflictSchema.parse({
          error: "SOURCE_KEY_ALREADY_EXISTS",
          message: "A source with this key already exists.",
        }),
      };
    }

    throw error;
  }
};
