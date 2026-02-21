import { games, watchlists } from "@db/schema";
import { gameNotFoundConflictSchema, watchlistResponseSchema } from "@shared/schemas";
import { eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type {
  gameNotFoundConflictSchema as gameNotFoundConflictSchemaType,
  watchlistInsertInputSchema,
  watchlistResponseSchema as watchlistResponseSchemaType,
} from "@shared/schemas";
import type { z } from "zod";

type CreateWatchlistInput = z.infer<typeof watchlistInsertInputSchema>;
type CreateWatchlistSuccess = z.infer<typeof watchlistResponseSchemaType>;
type CreateWatchlistGameNotFoundConflict = z.infer<typeof gameNotFoundConflictSchemaType>;

type CreateWatchlistResult =
  | { ok: true; data: CreateWatchlistSuccess }
  | { ok: false; error: CreateWatchlistGameNotFoundConflict };

export const createWatchlist = async ({
  db,
  user,
  ...input
}: CreateWatchlistInput & {
  db: AppDb;
  user: JwtUser;
}): Promise<CreateWatchlistResult> => {
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

  const [createdWatchlist] = await db
    .insert(watchlists)
    .values({ ...input, userId: user.id })
    .returning({
      createdAt: watchlists.createdAt,
      gameId: watchlists.gameId,
      id: watchlists.id,
      name: watchlists.name,
      userId: watchlists.userId,
    });

  return {
    ok: true,
    data: watchlistResponseSchema.parse(createdWatchlist),
  };
};
