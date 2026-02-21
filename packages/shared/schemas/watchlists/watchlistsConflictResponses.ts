import { z } from "zod";

export const watchlistNotFoundConflictSchema = z.object({
  error: z.literal("WATCHLIST_NOT_FOUND"),
  message: z.string(),
});
