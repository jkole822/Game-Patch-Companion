import { z } from "zod";

import {
  GameIdSchema,
  PatchEntryIdSchema,
  PatchEntryTextNullableSchema,
} from "./patchEntriesCommon";

export const patchEntryResponseSchema = z.object({
  checksum: PatchEntryTextNullableSchema,
  content: z.string(),
  createdAt: z.date(),
  fetchedAt: z.date().nullable(),
  gameId: GameIdSchema,
  id: PatchEntryIdSchema,
  publishedAt: z.date().nullable(),
  raw: PatchEntryTextNullableSchema,
  sourceId: z.uuid(),
  title: z.string(),
  url: z.string(),
});

export const patchEntriesResponseSchema = z.array(patchEntryResponseSchema);

export const patchEntryDeleteResponseSchema = z.object({
  message: z.string(),
});
