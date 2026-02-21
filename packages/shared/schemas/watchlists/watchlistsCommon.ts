import { z } from "zod";

export const WatchlistRecordIdSchema = z.uuid();

export const WatchlistBaseSchema = z.object({
  gameId: z.uuid(),
  name: z.string(),
});
