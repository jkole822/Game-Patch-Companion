import { watchlists } from "@db/schema";
import { watchlistNotFoundConflictSchema, watchlistResponseSchema } from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { watchlistUpdateInputSchema } from "@shared/schemas";
import type { z } from "zod";

type UpdateWatchlistInput = z.infer<typeof watchlistUpdateInputSchema>;
type UpdateWatchlistSuccess = z.infer<typeof watchlistResponseSchema>;
type UpdateWatchlistNotFoundConflict = z.infer<typeof watchlistNotFoundConflictSchema>;

type UpdateWatchlistResult =
  | { ok: true; data: UpdateWatchlistSuccess }
  | { ok: false; error: UpdateWatchlistNotFoundConflict };

export const updateWatchlist = async ({
  db,
  user,
  watchlistId,
  ...input
}: UpdateWatchlistInput & {
  db: AppDb;
  user: JwtUser;
  watchlistId: string;
}): Promise<UpdateWatchlistResult> => {
  const [updatedWatchlist] = await db
    .update(watchlists)
    .set(input)
    .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, user.id)))
    .returning({
      createdAt: watchlists.createdAt,
      id: watchlists.id,
      name: watchlists.name,
      userId: watchlists.userId,
    });

  if (!updatedWatchlist) {
    return {
      ok: false,
      error: watchlistNotFoundConflictSchema.parse({
        error: "WATCHLIST_NOT_FOUND",
        message: "Watchlist not found.",
      }),
    };
  }

  return {
    ok: true,
    data: watchlistResponseSchema.parse(updatedWatchlist),
  };
};
