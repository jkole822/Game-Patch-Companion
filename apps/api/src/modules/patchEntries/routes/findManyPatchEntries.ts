import { patchEntries } from "@db/schema";
import { patchEntriesResponseSchema } from "@shared/patchEntries";
import { and, eq } from "drizzle-orm";

import type { AppDb } from "@api-utils";
import type { patchEntryQuerySchema } from "@shared/patchEntries";
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
    query.id ? eq(patchEntries.id, query.id) : undefined,
    query.patchId ? eq(patchEntries.patchId, query.patchId) : undefined,
    query.sourceId ? eq(patchEntries.sourceId, query.sourceId) : undefined,
    query.state ? eq(patchEntries.state, query.state) : undefined,
    query.url ? eq(patchEntries.url, query.url) : undefined,
  ];

  const records = await db
    .select({
      checksum: patchEntries.checksum,
      content: patchEntries.content,
      createdAt: patchEntries.createdAt,
      fetchedAt: patchEntries.fetchedAt,
      id: patchEntries.id,
      patchId: patchEntries.patchId,
      publishedAt: patchEntries.publishedAt,
      raw: patchEntries.raw,
      sourceId: patchEntries.sourceId,
      state: patchEntries.state,
      url: patchEntries.url,
    })
    .from(patchEntries)
    .where(and(...filters));

  return {
    ok: true,
    data: patchEntriesResponseSchema.parse(records),
  };
};
