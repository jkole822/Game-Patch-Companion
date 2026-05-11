import { and, desc, eq } from "@db/orm";
import { patchEntries, watchlistItems, watchlistMatches, watchlists } from "@db/schema";
import { watchlistMatchesResponseSchema } from "@shared/schemas";

import type { AppDb, JwtUser } from "@api-utils";
import type { watchlistMatchQuerySchema } from "@shared/schemas";
import type { z } from "zod";

type FindManyWatchlistMatchesInput = z.infer<typeof watchlistMatchQuerySchema>;
type FindManyWatchlistMatchesSuccess = z.infer<typeof watchlistMatchesResponseSchema>;

export const findManyWatchlistMatches = async ({
  db,
  user,
  ...query
}: FindManyWatchlistMatchesInput & {
  db: AppDb;
  user: JwtUser;
}): Promise<{ ok: true; data: FindManyWatchlistMatchesSuccess }> => {
  const filters = [
    eq(watchlists.userId, user.id),
    query.patchEntryId ? eq(watchlistMatches.patchEntryId, query.patchEntryId) : undefined,
    query.state ? eq(watchlistMatches.state, query.state) : undefined,
    query.watchlistId ? eq(watchlistMatches.watchlistId, query.watchlistId) : undefined,
    query.watchlistItemId ? eq(watchlistMatches.watchlistItemId, query.watchlistItemId) : undefined,
  ];

  const records = await db
    .select({
      createdAt: watchlistMatches.createdAt,
      id: watchlistMatches.id,
      keyword: watchlistItems.keyword,
      matchText: watchlistMatches.matchText,
      patchEntryCreatedAt: patchEntries.createdAt,
      patchEntryId: watchlistMatches.patchEntryId,
      patchEntryPublishedAt: patchEntries.publishedAt,
      patchEntryTitle: patchEntries.title,
      patchEntryUrl: patchEntries.url,
      state: watchlistMatches.state,
      watchlistId: watchlistMatches.watchlistId,
      watchlistItemId: watchlistMatches.watchlistItemId,
      watchlistName: watchlists.name,
    })
    .from(watchlistMatches)
    .innerJoin(watchlists, eq(watchlists.id, watchlistMatches.watchlistId))
    .innerJoin(watchlistItems, eq(watchlistItems.id, watchlistMatches.watchlistItemId))
    .innerJoin(patchEntries, eq(patchEntries.id, watchlistMatches.patchEntryId))
    .where(and(...filters))
    .orderBy(
      desc(watchlistMatches.createdAt),
      desc(patchEntries.publishedAt),
      desc(patchEntries.createdAt),
    );

  return {
    ok: true,
    data: watchlistMatchesResponseSchema.parse(records),
  };
};
