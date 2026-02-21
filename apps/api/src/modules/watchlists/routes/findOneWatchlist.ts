import { watchlists } from "@db/schema";
import { watchlistNotFoundConflictSchema, watchlistResponseSchema } from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { z } from "zod";

type FindOneWatchlistSuccess = z.infer<typeof watchlistResponseSchema>;
type FindOneWatchlistNotFoundConflict = z.infer<typeof watchlistNotFoundConflictSchema>;

type FindOneWatchlistResult =
  | { ok: true; data: FindOneWatchlistSuccess }
  | { ok: false; error: FindOneWatchlistNotFoundConflict };

export const findOneWatchlist = async ({
  db,
  user,
  watchlistId,
}: {
  db: AppDb;
  user: JwtUser;
  watchlistId: string;
}): Promise<FindOneWatchlistResult> => {
  const [watchlist] = await db
    .select({
      createdAt: watchlists.createdAt,
      id: watchlists.id,
      name: watchlists.name,
      userId: watchlists.userId,
    })
    .from(watchlists)
    .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, user.id)))
    .limit(1);

  if (!watchlist) {
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
    data: watchlistResponseSchema.parse(watchlist),
  };
};
