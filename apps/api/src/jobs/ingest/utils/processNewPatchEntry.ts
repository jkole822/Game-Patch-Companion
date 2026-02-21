import {
  patchEntries,
  patchEntryDiffs,
  watchlists,
  watchlistItems,
  watchlistMatches,
} from "@db/schema";
import { and, desc, eq, inArray, ne } from "drizzle-orm";

import { computeLineDiff } from "./computeDiffLines";
import { diffStructuredLines } from "./diffStructuredLines";
import { matchWatchlistItems } from "./matchWatchlistItems";

import type { AppDb } from "@api-utils/db";
import type { createPatchEntryResponseSchema, WatchlistMatchesBaseSchema } from "@shared/schemas";
import type { z } from "zod";

type PatchEntryResponse = z.infer<typeof createPatchEntryResponseSchema>;

export async function processNewPatchEntry({
  db,
  newPatchEntry,
  sourceConfig,
}: {
  db: AppDb;
  newPatchEntry: PatchEntryResponse;
  sourceConfig?: Record<string, unknown>;
}) {
  try {
    const [prev] = await db
      .select()
      .from(patchEntries)
      .where(
        and(
          eq(patchEntries.sourceId, newPatchEntry.sourceId),
          eq(patchEntries.url, newPatchEntry.url),
          ne(patchEntries.id, newPatchEntry.id),
        ),
      )
      .orderBy(desc(patchEntries.createdAt))
      .limit(1);

    const prevContent = prev?.content ?? "";
    const nextContent = newPatchEntry.content;
    const diff =
      sourceConfig?.structureMode === "nestedLists"
        ? diffStructuredLines(prevContent, nextContent)
        : computeLineDiff(prevContent, nextContent);

    await db.insert(patchEntryDiffs).values({
      patchEntryId: newPatchEntry.id,
      added: diff.added,
      removed: diff.removed,
      stats: diff.stats,
    });

    // Watchlist matching is game-scoped; skip matching when game is not assigned.
    if (!newPatchEntry.gameId) {
      return;
    }

    const lists = await db
      .select()
      .from(watchlists)
      .where(eq(watchlists.gameId, newPatchEntry.gameId));

    if (lists.length === 0) {
      return;
    }

    const listIds = lists.map((l) => l.id);
    const items = await db
      .select()
      .from(watchlistItems)
      .where(inArray(watchlistItems.watchlistId, listIds));

    const byList = new Map<string, typeof items>();
    for (const it of items) {
      const arr = byList.get(it.watchlistId) ?? [];
      arr.push(it);
      byList.set(it.watchlistId, arr);
    }

    const rows: Array<z.infer<typeof WatchlistMatchesBaseSchema>> = [];
    for (const wl of lists) {
      const wlItems = byList.get(wl.id) ?? [];
      const hits = matchWatchlistItems(
        wlItems.map((i) => ({ id: i.id, keyword: i.keyword })),
        diff,
      );

      for (const hit of hits) {
        rows.push({
          patchEntryId: newPatchEntry.id,
          watchlistId: wl.id,
          watchlistItemId: hit.itemId,
          state: hit.kind,
          matchText: hit.text,
        });
      }
    }

    if (rows.length > 0) {
      await db.insert(watchlistMatches).values(rows);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to process patch entry ${newPatchEntry.id}: ${message}`);
  }
}
