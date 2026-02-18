import { patchEntries } from "@db/schema";
import { patchEntryNotFoundConflictSchema, patchEntryResponseSchema } from "@shared/schemas";
import { eq } from "drizzle-orm";

import type { AppDb } from "@api-utils";
import type { z } from "zod";

type FindOnePatchEntrySuccess = z.infer<typeof patchEntryResponseSchema>;
type FindOnePatchEntryNotFoundConflict = z.infer<typeof patchEntryNotFoundConflictSchema>;
type FindOnePatchEntryResult =
  | { ok: true; data: FindOnePatchEntrySuccess }
  | { ok: false; error: FindOnePatchEntryNotFoundConflict };

export const findOnePatchEntry = async ({
  db,
  patchEntryId,
}: {
  db: AppDb;
  patchEntryId: string;
}): Promise<FindOnePatchEntryResult> => {
  const [patchEntry] = await db
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
    .where(eq(patchEntries.id, patchEntryId))
    .limit(1);

  if (!patchEntry) {
    return {
      ok: false,
      error: patchEntryNotFoundConflictSchema.parse({
        error: "PATCH_ENTRY_NOT_FOUND",
        message: "Patch entry not found.",
      }),
    };
  }

  return {
    ok: true,
    data: patchEntryResponseSchema.parse(patchEntry),
  };
};
