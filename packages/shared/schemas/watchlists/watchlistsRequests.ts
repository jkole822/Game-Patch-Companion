import { z } from "zod";

import { WatchlistBaseSchema, WatchlistRecordIdSchema } from "./watchlistsCommon";

export const watchlistQuerySchema = z.object({
  gameId: z.uuid().optional(),
  name: z.string().optional(),
});

export const watchlistInsertInputSchema = WatchlistBaseSchema;

export const watchlistUpdateInputSchema = WatchlistBaseSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one watchlist field must be provided.",
  },
);

export const watchlistParamsSchema = z.object({
  id: WatchlistRecordIdSchema,
});
