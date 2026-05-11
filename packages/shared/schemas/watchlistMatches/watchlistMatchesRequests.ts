import { z } from "zod";

export const watchlistMatchQuerySchema = z.object({
  patchEntryId: z.uuid().optional(),
  state: z.enum(["added", "removed", "context"]).optional(),
  watchlistId: z.uuid().optional(),
  watchlistItemId: z.uuid().optional(),
});
