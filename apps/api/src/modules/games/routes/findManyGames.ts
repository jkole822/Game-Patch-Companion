import { games } from "@db/schema";
import { gamesResponseSchema } from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb } from "@api-utils";
import type { gameQuerySchema } from "@shared/schemas";
import type { z } from "zod";

type FindManyGamesInput = z.infer<typeof gameQuerySchema>;
type FindManyGamesSuccess = z.infer<typeof gamesResponseSchema>;

export const findManyGames = async ({
  db,
  ...query
}: FindManyGamesInput & { db: AppDb }): Promise<{ ok: true; data: FindManyGamesSuccess }> => {
  const filters = [
    query.key ? eq(games.key, query.key) : undefined,
    query.title ? eq(games.title, query.title) : undefined,
  ];

  const records = await db
    .select({
      createdAt: games.createdAt,
      id: games.id,
      key: games.key,
      title: games.title,
    })
    .from(games)
    .where(and(...filters));

  return {
    ok: true,
    data: gamesResponseSchema.parse(records),
  };
};
