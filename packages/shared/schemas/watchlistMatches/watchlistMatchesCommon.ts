import { z } from "zod";

export const WatchlistMatchesBaseSchema = z.object({
  patchEntryId: z.uuid(),
  watchlistItemId: z.uuid(),
  watchlistId: z.uuid(),
  state: z.enum(["added", "removed", "context"]),
  matchText: z.string(),
});
