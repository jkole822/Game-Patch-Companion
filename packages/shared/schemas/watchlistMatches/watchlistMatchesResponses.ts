import { z } from "zod";

import { WatchlistMatchesBaseSchema } from "./watchlistMatchesCommon";

export const watchlistMatchResponseSchema = WatchlistMatchesBaseSchema.extend({
  createdAt: z.date(),
  id: z.uuid(),
  keyword: z.string(),
  patchEntryCreatedAt: z.date(),
  patchEntryPublishedAt: z.date().nullable(),
  patchEntryTitle: z.string(),
  patchEntryUrl: z.string(),
  watchlistName: z.string(),
});

export const watchlistMatchesResponseSchema = z.array(watchlistMatchResponseSchema);
