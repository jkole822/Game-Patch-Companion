import { and, desc, eq } from "@db/orm";
import { patchEntries } from "@db/schema";
import { patchEntriesResponseSchema } from "@shared/schemas";

import type { AppDb } from "@api-utils";
import type { patchEntryQuerySchema } from "@shared/schemas";
import type { z } from "zod";

type FindManyPatchEntriesInput = z.infer<typeof patchEntryQuerySchema>;
type FindManyPatchEntriesSuccess = z.infer<typeof patchEntriesResponseSchema>;

// Hard cap applied when the caller does not supply an explicit limit, so the
// patch feed can never scan and serialize the entire table on a single request.
const DEFAULT_PATCH_ENTRY_LIMIT = 100;

export const findManyPatchEntries = async ({
  db,
  ...query
}: FindManyPatchEntriesInput & { db: AppDb }): Promise<{
  ok: true;
  data: FindManyPatchEntriesSuccess;
}> => {
  const filters = [
    query.gameId ? eq(patchEntries.gameId, query.gameId) : undefined,
    query.id ? eq(patchEntries.id, query.id) : undefined,
    query.sourceId ? eq(patchEntries.sourceId, query.sourceId) : undefined,
    query.title ? eq(patchEntries.title, query.title) : undefined,
    query.url ? eq(patchEntries.url, query.url) : undefined,
  ];

  const records = await db
    .select({
      checksum: patchEntries.checksum,
      content: patchEntries.content,
      createdAt: patchEntries.createdAt,
      fetchedAt: patchEntries.fetchedAt,
      gameId: patchEntries.gameId,
      id: patchEntries.id,
      publishedAt: patchEntries.publishedAt,
      raw: patchEntries.raw,
      sourceId: patchEntries.sourceId,
      title: patchEntries.title,
      url: patchEntries.url,
    })
    .from(patchEntries)
    .where(and(...filters))
    .orderBy(desc(patchEntries.publishedAt), desc(patchEntries.createdAt))
    .limit(query.limit ?? DEFAULT_PATCH_ENTRY_LIMIT);

  return {
    ok: true,
    data: patchEntriesResponseSchema.parse(records),
  };
};
