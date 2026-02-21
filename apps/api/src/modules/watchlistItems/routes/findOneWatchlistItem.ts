import { watchlistItems, watchlists } from "@db/schema";
import { watchlistItemNotFoundConflictSchema, watchlistItemResponseSchema } from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { z } from "zod";

type FindOneWatchlistItemSuccess = z.infer<typeof watchlistItemResponseSchema>;
type FindOneWatchlistItemNotFoundConflict = z.infer<typeof watchlistItemNotFoundConflictSchema>;

type FindOneWatchlistItemResult =
  | { ok: true; data: FindOneWatchlistItemSuccess }
  | { ok: false; error: FindOneWatchlistItemNotFoundConflict };

export const findOneWatchlistItem = async ({
  db,
  user,
  watchlistItemId,
}: {
  db: AppDb;
  user: JwtUser;
  watchlistItemId: string;
}): Promise<FindOneWatchlistItemResult> => {
  const [watchlistItem] = await db
    .select({
      createdAt: watchlistItems.createdAt,
      id: watchlistItems.id,
      keyword: watchlistItems.keyword,
      watchlistId: watchlistItems.watchlistId,
    })
    .from(watchlistItems)
    .innerJoin(watchlists, eq(watchlists.id, watchlistItems.watchlistId))
    .where(and(eq(watchlistItems.id, watchlistItemId), eq(watchlists.userId, user.id)))
    .limit(1);

  if (!watchlistItem) {
    return {
      ok: false,
      error: watchlistItemNotFoundConflictSchema.parse({
        error: "WATCHLIST_ITEM_NOT_FOUND",
        message: "Watchlist item not found.",
      }),
    };
  }

  return {
    ok: true,
    data: watchlistItemResponseSchema.parse(watchlistItem),
  };
};
