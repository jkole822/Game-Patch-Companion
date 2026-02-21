import { z } from "zod";

export const watchlistItemConflictSchema = z.object({
  error: z.literal("WATCHLIST_ITEM_KEYWORD_ALREADY_EXISTS"),
  message: z.string(),
});

export const watchlistItemNotFoundConflictSchema = z.object({
  error: z.literal("WATCHLIST_ITEM_NOT_FOUND"),
  message: z.string(),
});
