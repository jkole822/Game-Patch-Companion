import { sources, users } from "@db/schema";
import { rolePermissionConflictSchema } from "@shared/auth";
import { sourceConflictSchema, sourceResponseSchema } from "@shared/sources";
import { eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { sourceInsertInputSchema } from "@shared/sources";
import type { z } from "zod";

type CreateSourceInput = z.infer<typeof sourceInsertInputSchema>;
type CreateSourceSuccess = z.infer<typeof sourceResponseSchema>;
type CreateSourceConflict = z.infer<typeof sourceConflictSchema>;
type CreateRolePermissionConflict = z.infer<typeof rolePermissionConflictSchema>;

type CreateSourceResult =
  | { ok: true; data: CreateSourceSuccess }
  | { ok: false; error: CreateSourceConflict }
  | { ok: false; error: CreateRolePermissionConflict };

export const createSource = async ({
  db,
  user,
  ...input
}: CreateSourceInput & { db: AppDb; user: JwtUser }): Promise<CreateSourceResult> => {
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
          message: "You do not have permission to create sources.",
        }),
      };
    }

    const [createdSource] = await db.insert(sources).values(input).returning({
      baseUrl: sources.baseUrl,
      config: sources.config,
      createdAt: sources.createdAt,
      id: sources.id,
      isEnabled: sources.isEnabled,
      key: sources.key,
      name: sources.name,
      type: sources.type,
    });

    return {
      ok: true,
      data: sourceResponseSchema.parse(createdSource),
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
