import { z } from "zod";

export const WatchlistItemRecordIdSchema = z.uuid();

export const WatchlistItemBaseSchema = z.object({
  keyword: z.string(),
  watchlistId: z.uuid(),
});
