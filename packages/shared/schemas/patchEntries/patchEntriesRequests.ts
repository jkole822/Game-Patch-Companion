import { z } from "zod";

import {
  PatchEntryDateInputSchema,
  PatchEntryIdSchema,
  PatchEntryTextNullableSchema,
  PatchIdSchema,
  patchEntryStateSchema,
} from "./patchEntriesCommon";

export const patchEntryQuerySchema = z.object({
  id: PatchEntryIdSchema.optional(),
  patchId: PatchIdSchema.optional(),
  sourceId: z.uuid().optional(),
  state: patchEntryStateSchema.optional(),
  url: z.string().optional(),
});

export const patchEntryParamsSchema = z.object({
  id: PatchEntryIdSchema,
});

export const patchEntryInsertInputSchema = z.object({
  checksum: PatchEntryTextNullableSchema.optional(),
  content: z.string(),
  fetchedAt: PatchEntryDateInputSchema,
  patchId: PatchIdSchema.optional(),
  publishedAt: PatchEntryDateInputSchema,
  raw: PatchEntryTextNullableSchema.optional(),
  sourceId: z.uuid(),
  state: patchEntryStateSchema.optional().default("new"),
  url: z.string(),
});

export const patchEntryUpdateInputSchema = patchEntryInsertInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one patch entry field must be provided.",
  });
