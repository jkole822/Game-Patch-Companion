import { z } from "zod";

import {
  PatchEntryIdSchema,
  PatchEntryTextNullableSchema,
  PatchIdSchema,
  patchEntryStateSchema,
} from "./patchEntriesCommon";

export const patchEntryResponseSchema = z.object({
  checksum: PatchEntryTextNullableSchema,
  content: z.string(),
  createdAt: z.date(),
  fetchedAt: z.date().nullable(),
  id: PatchEntryIdSchema,
  patchId: PatchIdSchema,
  publishedAt: z.date().nullable(),
  raw: PatchEntryTextNullableSchema,
  sourceId: z.uuid(),
  state: patchEntryStateSchema,
  url: z.string(),
});

export const patchEntriesResponseSchema = z.array(patchEntryResponseSchema);

export const patchEntryDeleteResponseSchema = z.object({
  message: z.string(),
});
