import { z } from "zod";

export const patchEntryConflictSchema = z.object({
  error: z.enum(["PATCH_ENTRY_SOURCE_URL_ALREADY_EXISTS", "PATCH_ENTRY_REFERENCE_NOT_FOUND"]),
  message: z.string(),
});

export const patchEntryNotFoundConflictSchema = z.object({
  error: z.literal("PATCH_ENTRY_NOT_FOUND"),
  message: z.string(),
});
