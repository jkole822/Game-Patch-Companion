import { sources, users } from "@db/schema";
import { rolePermissionConflictSchema } from "@shared/auth";
import {
  sourceDeleteResponseSchema,
  sourceInUseConflictSchema,
  sourceNotFoundConflictSchema,
} from "@shared/sources";
import { eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { z } from "zod";

type DeleteSourceSuccess = z.infer<typeof sourceDeleteResponseSchema>;
type DeleteSourceNotFoundConflict = z.infer<typeof sourceNotFoundConflictSchema>;
type DeleteSourceInUseConflict = z.infer<typeof sourceInUseConflictSchema>;
type DeleteRolePermissionConflict = z.infer<typeof rolePermissionConflictSchema>;

type DeleteSourceResult =
  | { ok: true; data: DeleteSourceSuccess }
  | { ok: false; error: DeleteSourceNotFoundConflict }
  | { ok: false; error: DeleteSourceInUseConflict }
  | { ok: false; error: DeleteRolePermissionConflict };

export const deleteSource = async ({
  db,
  sourceId,
  user,
}: {
  db: AppDb;
  sourceId: string;
  user: JwtUser;
}): Promise<DeleteSourceResult> => {
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
          message: "You do not have permission to delete sources.",
        }),
      };
    }

    const [deletedSource] = await db
      .delete(sources)
      .where(eq(sources.id, sourceId))
      .returning({ id: sources.id });

    if (!deletedSource) {
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
      data: sourceDeleteResponseSchema.parse({
        message: "Source deleted successfully.",
      }),
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23503") {
      return {
        ok: false,
        error: sourceInUseConflictSchema.parse({
          error: "SOURCE_IN_USE",
          message: "Source cannot be deleted because it is referenced by patch entries.",
        }),
      };
    }

    throw error;
  }
};
