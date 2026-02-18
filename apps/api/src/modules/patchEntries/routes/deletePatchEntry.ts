import { patchEntries, users } from "@db/schema";
import { rolePermissionConflictSchema } from "@shared/auth";
import {
  patchEntryDeleteResponseSchema,
  patchEntryNotFoundConflictSchema,
} from "@shared/patchEntries";
import { eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { z } from "zod";

type DeletePatchEntrySuccess = z.infer<typeof patchEntryDeleteResponseSchema>;
type DeletePatchEntryNotFoundConflict = z.infer<typeof patchEntryNotFoundConflictSchema>;
type DeleteRolePermissionConflict = z.infer<typeof rolePermissionConflictSchema>;

type DeletePatchEntryResult =
  | { ok: true; data: DeletePatchEntrySuccess }
  | { ok: false; error: DeletePatchEntryNotFoundConflict }
  | { ok: false; error: DeleteRolePermissionConflict };

export const deletePatchEntry = async ({
  db,
  patchEntryId,
  user,
}: {
  db: AppDb;
  patchEntryId: string;
  user: JwtUser;
}): Promise<DeletePatchEntryResult> => {
  const [authUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

  if (!authUser) {
    throw new Error("User not found");
  }

  if (authUser.role !== "admin") {
    return {
      ok: false,
      error: rolePermissionConflictSchema.parse({
        error: "NO_PERMISSION_FOR_ROLE",
        message: "You do not have permission to delete patch entries.",
      }),
    };
  }

  const [deletedPatchEntry] = await db
    .delete(patchEntries)
    .where(eq(patchEntries.id, patchEntryId))
    .returning({ id: patchEntries.id });

  if (!deletedPatchEntry) {
    return {
      ok: false,
      error: patchEntryNotFoundConflictSchema.parse({
        error: "PATCH_ENTRY_NOT_FOUND",
        message: "Patch entry not found.",
      }),
    };
  }

  return {
    ok: true,
    data: patchEntryDeleteResponseSchema.parse({
      message: "Patch entry deleted successfully.",
    }),
  };
};
