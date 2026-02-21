import { watchlists } from "@db/schema";
import { watchlistDeleteResponseSchema, watchlistNotFoundConflictSchema } from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { z } from "zod";

type DeleteWatchlistSuccess = z.infer<typeof watchlistDeleteResponseSchema>;
type DeleteWatchlistNotFoundConflict = z.infer<typeof watchlistNotFoundConflictSchema>;

type DeleteWatchlistResult =
  | { ok: true; data: DeleteWatchlistSuccess }
  | { ok: false; error: DeleteWatchlistNotFoundConflict };

export const deleteWatchlist = async ({
  db,
  user,
  watchlistId,
}: {
  db: AppDb;
  user: JwtUser;
  watchlistId: string;
}): Promise<DeleteWatchlistResult> => {
  const [deletedWatchlist] = await db
    .delete(watchlists)
    .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, user.id)))
    .returning({ id: watchlists.id });

  if (!deletedWatchlist) {
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
    data: watchlistDeleteResponseSchema.parse({
      message: "Watchlist deleted successfully.",
    }),
  };
};
