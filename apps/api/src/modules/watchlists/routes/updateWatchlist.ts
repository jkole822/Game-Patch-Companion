import { games, watchlists } from "@db/schema";
import {
  gameNotFoundConflictSchema,
  watchlistNotFoundConflictSchema,
  watchlistResponseSchema,
} from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type {
  gameNotFoundConflictSchema as gameNotFoundConflictSchemaType,
  watchlistNotFoundConflictSchema as watchlistNotFoundConflictSchemaType,
  watchlistResponseSchema as watchlistResponseSchemaType,
  watchlistUpdateInputSchema,
} from "@shared/schemas";
import type { z } from "zod";

type UpdateWatchlistInput = z.infer<typeof watchlistUpdateInputSchema>;
type UpdateWatchlistSuccess = z.infer<typeof watchlistResponseSchemaType>;
type UpdateWatchlistNotFoundConflict = z.infer<typeof watchlistNotFoundConflictSchemaType>;
type UpdateWatchlistGameNotFoundConflict = z.infer<typeof gameNotFoundConflictSchemaType>;

type UpdateWatchlistResult =
  | { ok: true; data: UpdateWatchlistSuccess }
  | { ok: false; error: UpdateWatchlistNotFoundConflict }
  | { ok: false; error: UpdateWatchlistGameNotFoundConflict };

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
  if (input.gameId) {
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
  }

  const [updatedWatchlist] = await db
    .update(watchlists)
    .set(input)
    .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, user.id)))
    .returning({
      createdAt: watchlists.createdAt,
      gameId: watchlists.gameId,
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
