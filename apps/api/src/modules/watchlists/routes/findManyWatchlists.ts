import { watchlists } from "@db/schema";
import { watchlistsResponseSchema } from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { watchlistQuerySchema } from "@shared/schemas";
import type { z } from "zod";

type FindManyWatchlistsInput = z.infer<typeof watchlistQuerySchema>;
type FindManyWatchlistsSuccess = z.infer<typeof watchlistsResponseSchema>;

export const findManyWatchlists = async ({
  db,
  user,
  ...query
}: FindManyWatchlistsInput & {
  db: AppDb;
  user: JwtUser;
}): Promise<{ ok: true; data: FindManyWatchlistsSuccess }> => {
  const filters = [
    eq(watchlists.userId, user.id),
    query.gameId ? eq(watchlists.gameId, query.gameId) : undefined,
    query.name ? eq(watchlists.name, query.name) : undefined,
  ];

  const records = await db
    .select({
      createdAt: watchlists.createdAt,
      gameId: watchlists.gameId,
      id: watchlists.id,
      name: watchlists.name,
      userId: watchlists.userId,
    })
    .from(watchlists)
    .where(and(...filters));

  return {
    ok: true,
    data: watchlistsResponseSchema.parse(records),
  };
};
