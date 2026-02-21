import { watchlistItems, watchlists } from "@db/schema";
import { watchlistItemsResponseSchema } from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb, JwtUser } from "@api-utils";
import type { watchlistItemQuerySchema } from "@shared/schemas";
import type { z } from "zod";

type FindManyWatchlistItemsInput = z.infer<typeof watchlistItemQuerySchema>;
type FindManyWatchlistItemsSuccess = z.infer<typeof watchlistItemsResponseSchema>;

export const findManyWatchlistItems = async ({
  db,
  user,
  ...query
}: FindManyWatchlistItemsInput & {
  db: AppDb;
  user: JwtUser;
}): Promise<{ ok: true; data: FindManyWatchlistItemsSuccess }> => {
  const filters = [
    eq(watchlists.userId, user.id),
    query.keyword ? eq(watchlistItems.keyword, query.keyword) : undefined,
    query.watchlistId ? eq(watchlistItems.watchlistId, query.watchlistId) : undefined,
  ];

  const records = await db
    .select({
      createdAt: watchlistItems.createdAt,
      id: watchlistItems.id,
      keyword: watchlistItems.keyword,
      watchlistId: watchlistItems.watchlistId,
    })
    .from(watchlistItems)
    .innerJoin(watchlists, eq(watchlists.id, watchlistItems.watchlistId))
    .where(and(...filters));

  return {
    ok: true,
    data: watchlistItemsResponseSchema.parse(records),
  };
};
