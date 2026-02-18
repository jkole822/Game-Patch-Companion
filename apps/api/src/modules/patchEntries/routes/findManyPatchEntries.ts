import { patchEntries } from "@db/schema";
import { patchEntriesResponseSchema } from "@shared/schemas";
import { and, eq } from "drizzle-orm";

import type { AppDb } from "@api-utils";
import type { patchEntryQuerySchema } from "@shared/schemas";
import type { z } from "zod";

type FindManyPatchEntriesInput = z.infer<typeof patchEntryQuerySchema>;
type FindManyPatchEntriesSuccess = z.infer<typeof patchEntriesResponseSchema>;

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
    .where(and(...filters));

  return {
    ok: true,
    data: patchEntriesResponseSchema.parse(records),
  };
};
