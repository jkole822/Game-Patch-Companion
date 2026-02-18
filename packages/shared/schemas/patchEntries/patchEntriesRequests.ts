import { z } from "zod";

import {
  GameIdSchema,
  PatchEntryDateInputSchema,
  PatchEntryIdSchema,
  PatchEntryTextNullableSchema,
} from "./patchEntriesCommon";

export const patchEntryQuerySchema = z.object({
  gameId: GameIdSchema.optional(),
  id: PatchEntryIdSchema.optional(),
  sourceId: z.uuid().optional(),
  title: z.string().optional(),
  url: z.string().optional(),
});

export const patchEntryParamsSchema = z.object({
  id: PatchEntryIdSchema,
});

export const patchEntryInsertInputSchema = z.object({
  checksum: PatchEntryTextNullableSchema.optional(),
  content: z.string(),
  fetchedAt: PatchEntryDateInputSchema,
  gameId: GameIdSchema.optional(),
  publishedAt: PatchEntryDateInputSchema,
  raw: PatchEntryTextNullableSchema.optional(),
  sourceId: z.uuid(),
  title: z.string(),
  url: z.string(),
});

export const patchEntryUpdateInputSchema = patchEntryInsertInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one patch entry field must be provided.",
  });
