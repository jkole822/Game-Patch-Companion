import { watchlistItems, watchlists } from "@db/schema";
import {
  watchlistItemConflictSchema,
  watchlistItemNotFoundConflictSchema,
  watchlistItemResponseSchema,
  watchlistNotFoundConflictSchema,
} from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type {
  watchlistItemConflictSchema as watchlistItemConflictSchemaType,
  watchlistItemNotFoundConflictSchema as watchlistItemNotFoundConflictSchemaType,
  watchlistItemResponseSchema as watchlistItemResponseSchemaType,
  watchlistItemUpdateInputSchema,
  watchlistNotFoundConflictSchema as watchlistNotFoundConflictSchemaType,
} from "@shared/schemas";
import type { z } from "zod";

type UpdateWatchlistItemInput = z.infer<typeof watchlistItemUpdateInputSchema>;
type UpdateWatchlistItemSuccess = z.infer<typeof watchlistItemResponseSchemaType>;
type UpdateWatchlistItemConflict = z.infer<typeof watchlistItemConflictSchemaType>;
type UpdateWatchlistItemNotFoundConflict = z.infer<typeof watchlistItemNotFoundConflictSchemaType>;
type UpdateWatchlistItemWatchlistNotFoundConflict = z.infer<
  typeof watchlistNotFoundConflictSchemaType
>;

type UpdateWatchlistItemResult =
  | { ok: true; data: UpdateWatchlistItemSuccess }
  | { ok: false; error: UpdateWatchlistItemConflict }
  | { ok: false; error: UpdateWatchlistItemNotFoundConflict }
  | { ok: false; error: UpdateWatchlistItemWatchlistNotFoundConflict };

export const updateWatchlistItem = async ({
  db,
  user,
  watchlistItemId,
  ...input
}: UpdateWatchlistItemInput & {
  db: AppDb;
  user: JwtUser;
  watchlistItemId: string;
}): Promise<UpdateWatchlistItemResult> => {
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

  if (input.watchlistId) {
    const [watchlist] = await db
      .select({ id: watchlists.id })
      .from(watchlists)
      .where(and(eq(watchlists.id, input.watchlistId), eq(watchlists.userId, user.id)))
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
  }

  try {
    const [updatedWatchlistItem] = await db
      .update(watchlistItems)
      .set(input)
      .where(eq(watchlistItems.id, watchlistItemId))
      .returning({
        createdAt: watchlistItems.createdAt,
        id: watchlistItems.id,
        keyword: watchlistItems.keyword,
        watchlistId: watchlistItems.watchlistId,
      });

    if (!updatedWatchlistItem) {
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
      data: watchlistItemResponseSchema.parse(updatedWatchlistItem),
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return {
        ok: false,
        error: watchlistItemConflictSchema.parse({
          error: "WATCHLIST_ITEM_KEYWORD_ALREADY_EXISTS",
          message: "A watchlist item with this keyword already exists.",
        }),
      };
    }

    throw error;
  }
};
