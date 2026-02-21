import { games, watchlistItems, watchlists } from "@db/schema";
import {
  gameNotFoundConflictSchema,
  watchlistItemConflictSchema,
  watchlistItemResponseSchema,
  watchlistNotFoundConflictSchema,
} from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type {
  gameNotFoundConflictSchema as gameNotFoundConflictSchemaType,
  watchlistItemConflictSchema as watchlistItemConflictSchemaType,
  watchlistItemInsertInputSchema,
  watchlistItemResponseSchema as watchlistItemResponseSchemaType,
  watchlistNotFoundConflictSchema as watchlistNotFoundConflictSchemaType,
} from "@shared/schemas";
import type { z } from "zod";

type CreateWatchlistItemInput = z.infer<typeof watchlistItemInsertInputSchema>;
type CreateWatchlistItemSuccess = z.infer<typeof watchlistItemResponseSchemaType>;
type CreateWatchlistItemConflict = z.infer<typeof watchlistItemConflictSchemaType>;
type CreateWatchlistItemWatchlistNotFoundConflict = z.infer<
  typeof watchlistNotFoundConflictSchemaType
>;
type CreateWatchlistItemGameNotFoundConflict = z.infer<typeof gameNotFoundConflictSchemaType>;

type CreateWatchlistItemResult =
  | { ok: true; data: CreateWatchlistItemSuccess }
  | { ok: false; error: CreateWatchlistItemConflict }
  | { ok: false; error: CreateWatchlistItemWatchlistNotFoundConflict }
  | { ok: false; error: CreateWatchlistItemGameNotFoundConflict };

export const createWatchlistItem = async ({
  db,
  user,
  ...input
}: CreateWatchlistItemInput & {
  db: AppDb;
  user: JwtUser;
}): Promise<CreateWatchlistItemResult> => {
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

  const [game] = await db
    .select({ id: games.id })
    .from(games)
    .where(eq(games.id, input.gameId))
    .limit(1);

  if (!game) {
    return {
      ok: false,
      error: gameNotFoundConflictSchema.parse({
        error: "GAME_NOT_FOUND",
        message: "Game not found.",
      }),
    };
  }

  try {
    const [createdWatchlistItem] = await db.insert(watchlistItems).values(input).returning({
      createdAt: watchlistItems.createdAt,
      gameId: watchlistItems.gameId,
      id: watchlistItems.id,
      keyword: watchlistItems.keyword,
      watchlistId: watchlistItems.watchlistId,
    });

    return {
      ok: true,
      data: watchlistItemResponseSchema.parse(createdWatchlistItem),
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
