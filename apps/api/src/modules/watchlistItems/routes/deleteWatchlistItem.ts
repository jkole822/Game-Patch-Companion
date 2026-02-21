import { watchlistItems, watchlists } from "@db/schema";
import {
  watchlistItemDeleteResponseSchema,
  watchlistItemNotFoundConflictSchema,
} from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { z } from "zod";

type DeleteWatchlistItemSuccess = z.infer<typeof watchlistItemDeleteResponseSchema>;
type DeleteWatchlistItemNotFoundConflict = z.infer<typeof watchlistItemNotFoundConflictSchema>;

type DeleteWatchlistItemResult =
  | { ok: true; data: DeleteWatchlistItemSuccess }
  | { ok: false; error: DeleteWatchlistItemNotFoundConflict };

export const deleteWatchlistItem = async ({
  db,
  user,
  watchlistItemId,
}: {
  db: AppDb;
  user: JwtUser;
  watchlistItemId: string;
}): Promise<DeleteWatchlistItemResult> => {
  const [existingItem] = await db
    .select({ id: watchlistItems.id })
    .from(watchlistItems)
    .innerJoin(watchlists, eq(watchlists.id, watchlistItems.watchlistId))
    .where(and(eq(watchlistItems.id, watchlistItemId), eq(watchlists.userId, user.id)))
    .limit(1);

  if (!existingItem) {
    return {
      ok: false,
      error: watchlistItemNotFoundConflictSchema.parse({
        error: "WATCHLIST_ITEM_NOT_FOUND",
        message: "Watchlist item not found.",
      }),
    };
  }

  await db.delete(watchlistItems).where(eq(watchlistItems.id, watchlistItemId));

  return {
    ok: true,
    data: watchlistItemDeleteResponseSchema.parse({
      message: "Watchlist item deleted successfully.",
    }),
  };
};
