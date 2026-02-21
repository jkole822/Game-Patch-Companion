import { z } from "zod";

import { WatchlistItemBaseSchema, WatchlistItemRecordIdSchema } from "./watchlistItemsCommon";

export const watchlistItemResponseSchema = WatchlistItemBaseSchema.extend({
  createdAt: z.date(),
  id: WatchlistItemRecordIdSchema,
});

export const watchlistItemsResponseSchema = z.array(watchlistItemResponseSchema);

export const watchlistItemDeleteResponseSchema = z.object({
  message: z.string(),
});
