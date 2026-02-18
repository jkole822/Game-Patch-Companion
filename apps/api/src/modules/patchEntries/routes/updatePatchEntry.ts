import { patchEntries, users } from "@db/schema";
import { rolePermissionConflictSchema } from "@shared/schemas";
import {
  patchEntryConflictSchema,
  patchEntryNotFoundConflictSchema,
  patchEntryResponseSchema,
} from "@shared/schemas";
import { eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { patchEntryUpdateInputSchema } from "@shared/schemas";
import type { z } from "zod";

type UpdatePatchEntryInput = z.infer<typeof patchEntryUpdateInputSchema>;
type UpdatePatchEntrySuccess = z.infer<typeof patchEntryResponseSchema>;
type UpdatePatchEntryConflict = z.infer<typeof patchEntryConflictSchema>;
type UpdatePatchEntryNotFoundConflict = z.infer<typeof patchEntryNotFoundConflictSchema>;
type UpdateRolePermissionConflict = z.infer<typeof rolePermissionConflictSchema>;

type UpdatePatchEntryResult =
  | { ok: true; data: UpdatePatchEntrySuccess }
  | { ok: false; error: UpdatePatchEntryConflict }
  | { ok: false; error: UpdatePatchEntryNotFoundConflict }
  | { ok: false; error: UpdateRolePermissionConflict };

export const updatePatchEntry = async ({
  db,
  patchEntryId,
  user,
  ...input
}: UpdatePatchEntryInput & {
  db: AppDb;
  patchEntryId: string;
  user: JwtUser;
}): Promise<UpdatePatchEntryResult> => {
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
          message: "You do not have permission to update patch entries.",
        }),
      };
    }

    const [updatedPatchEntry] = await db
      .update(patchEntries)
      .set(input)
      .where(eq(patchEntries.id, patchEntryId))
      .returning({
        checksum: patchEntries.checksum,
        content: patchEntries.content,
        createdAt: patchEntries.createdAt,
        fetchedAt: patchEntries.fetchedAt,
        id: patchEntries.id,
        patchId: patchEntries.patchId,
        publishedAt: patchEntries.publishedAt,
        raw: patchEntries.raw,
        sourceId: patchEntries.sourceId,
        state: patchEntries.state,
        url: patchEntries.url,
      });

    if (!updatedPatchEntry) {
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
      data: patchEntryResponseSchema.parse(updatedPatchEntry),
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return {
        ok: false,
        error: patchEntryConflictSchema.parse({
          error: "PATCH_ENTRY_SOURCE_URL_ALREADY_EXISTS",
          message: "A patch entry with this source and url already exists.",
        }),
      };
    }

    if (typeof error === "object" && error !== null && "code" in error && error.code === "23503") {
      return {
        ok: false,
        error: patchEntryConflictSchema.parse({
          error: "PATCH_ENTRY_REFERENCE_NOT_FOUND",
          message: "The provided source or patch does not exist.",
        }),
      };
    }

    throw error;
  }
};
