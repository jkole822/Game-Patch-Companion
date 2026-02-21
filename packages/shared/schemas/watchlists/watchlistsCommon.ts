import { z } from "zod";

export const WatchlistRecordIdSchema = z.uuid();

export const WatchlistBaseSchema = z.object({
  name: z.string(),
});
