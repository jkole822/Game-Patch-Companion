import { z } from "zod";

export const patchEntryStateSchema = z.enum(["new", "assigned", "ignored", "error"]);

const patchEntryDateInputSchema = z.coerce.date().nullable().optional();

export const patchEntryQuerySchema = z.object({
  id: z.uuid().optional(),
  patchId: z.uuid().optional(),
  sourceId: z.uuid().optional(),
  state: patchEntryStateSchema.optional(),
  url: z.string().optional(),
});

export const patchEntryInsertInputSchema = z.object({
  checksum: z.string().nullable().optional(),
  content: z.string(),
  fetchedAt: patchEntryDateInputSchema,
  patchId: z.uuid().nullable().optional(),
  publishedAt: patchEntryDateInputSchema,
  raw: z.string().nullable().optional(),
  sourceId: z.uuid(),
  state: patchEntryStateSchema.optional().default("new"),
  url: z.string(),
});

export const patchEntryUpdateInputSchema = patchEntryInsertInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one patch entry field must be provided.",
  });

export const patchEntryParamsSchema = z.object({
  id: z.uuid(),
});

export const patchEntryResponseSchema = z.object({
  checksum: z.string().nullable(),
  content: z.string(),
  createdAt: z.date(),
  fetchedAt: z.date().nullable(),
  id: z.uuid(),
  patchId: z.uuid().nullable(),
  publishedAt: z.date().nullable(),
  raw: z.string().nullable(),
  sourceId: z.uuid(),
  state: patchEntryStateSchema,
  url: z.string(),
});

export const patchEntriesResponseSchema = z.array(patchEntryResponseSchema);

export const patchEntryConflictSchema = z.object({
  error: z.enum(["PATCH_ENTRY_SOURCE_URL_ALREADY_EXISTS", "PATCH_ENTRY_REFERENCE_NOT_FOUND"]),
  message: z.string(),
});

export const patchEntryNotFoundConflictSchema = z.object({
  error: z.literal("PATCH_ENTRY_NOT_FOUND"),
  message: z.string(),
});

export const patchEntryDeleteResponseSchema = z.object({
  message: z.string(),
});
