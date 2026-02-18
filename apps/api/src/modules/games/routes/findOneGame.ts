import { games } from "@db/schema";
import { gameNotFoundConflictSchema, gameResponseSchema } from "@shared/schemas";
import { eq } from "drizzle-orm";

import type { AppDb } from "@api-utils";
import type { z } from "zod";

type FindOneGameSuccess = z.infer<typeof gameResponseSchema>;
type FindOneGameNotFoundConflict = z.infer<typeof gameNotFoundConflictSchema>;
type FindOneGameResult =
  | { ok: true; data: FindOneGameSuccess }
  | { ok: false; error: FindOneGameNotFoundConflict };

export const findOneGame = async ({
  db,
  gameId,
}: {
  db: AppDb;
  gameId: string;
}): Promise<FindOneGameResult> => {
  const [game] = await db
    .select({
      createdAt: games.createdAt,
      id: games.id,
      key: games.key,
      title: games.title,
    })
    .from(games)
    .where(eq(games.id, gameId))
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

  return {
    ok: true,
    data: gameResponseSchema.parse(game),
  };
};
