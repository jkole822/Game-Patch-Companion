import { z } from "zod";

import { WatchlistBaseSchema, WatchlistRecordIdSchema } from "./watchlistsCommon";

export const watchlistResponseSchema = WatchlistBaseSchema.extend({
  createdAt: z.date(),
  id: WatchlistRecordIdSchema,
  userId: z.uuid(),
});

export const watchlistsResponseSchema = z.array(watchlistResponseSchema);

export const watchlistDeleteResponseSchema = z.object({
  message: z.string(),
});
