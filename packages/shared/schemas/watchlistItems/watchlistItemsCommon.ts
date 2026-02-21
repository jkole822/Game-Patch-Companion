import { z } from "zod";

export const WatchlistItemRecordIdSchema = z.uuid();

export const WatchlistItemBaseSchema = z.object({
  gameId: z.uuid(),
  keyword: z.string(),
  watchlistId: z.uuid(),
});
