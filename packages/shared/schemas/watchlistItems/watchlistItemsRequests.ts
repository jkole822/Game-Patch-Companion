import { z } from "zod";

import { WatchlistItemBaseSchema, WatchlistItemRecordIdSchema } from "./watchlistItemsCommon";

export const watchlistItemQuerySchema = z.object({
  keyword: z.string().optional(),
  watchlistId: z.uuid().optional(),
});

export const watchlistItemInsertInputSchema = WatchlistItemBaseSchema;

export const watchlistItemUpdateInputSchema = WatchlistItemBaseSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one watchlist item field must be provided.",
  },
);

export const watchlistItemParamsSchema = z.object({
  id: WatchlistItemRecordIdSchema,
});
