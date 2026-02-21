import { games, patchEntries, sources } from "@db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";

import { processNewPatchEntry } from "./processNewPatchEntry";

import type { AppDb } from "@api-utils";

export type AssignGamesJobResult = {
  status: "completed";
  assignedEntries: number;
  processedEntries: number;
  skippedEntries: number;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
};

const normalizeText = (value: string): string => value.trim().toLowerCase();

const inferGameKeyFromText = ({
  content,
  title,
}: {
  content: string;
  title: string;
}): string | null => {
  const haystack = `${title} ${content}`.toLowerCase();

  if (/(world of warcraft|\bwow\b)/i.test(haystack)) return "wow";
  if (/(diablo\s*4|\bd4\b)/i.test(haystack)) return "diablo4";
  if (/helldivers\s*2/i.test(haystack)) return "helldivers2";

  return null;
};

const inferGameKeyFromSourceKey = ({
  knownGameKeys,
  sourceKey,
}: {
  knownGameKeys: string[];
  sourceKey: string;
}): string | null => {
  const normalizedSourceKey = normalizeText(sourceKey);

  if (!normalizedSourceKey) {
    return null;
  }

  if (knownGameKeys.includes(normalizedSourceKey)) {
    return normalizedSourceKey;
  }

  const compactSourceKey = normalizedSourceKey.replace(/[^a-z0-9]/g, "");

  const sortedKeys = [...knownGameKeys].sort((a, b) => b.length - a.length);

  for (const gameKey of sortedKeys) {
    const compactGameKey = gameKey.replace(/[^a-z0-9]/g, "");

    if (
      normalizedSourceKey.startsWith(`${gameKey}-`) ||
      normalizedSourceKey.startsWith(`${gameKey}_`) ||
      normalizedSourceKey.startsWith(`${gameKey}:`) ||
      compactSourceKey.startsWith(compactGameKey)
    ) {
      return gameKey;
    }
  }

  const segments = normalizedSourceKey.split(/[^a-z0-9]+/).filter(Boolean);
  for (const segment of segments) {
    if (knownGameKeys.includes(segment)) {
      return segment;
    }
  }

  return null;
};

export const assignGames = async ({ db }: { db: AppDb }): Promise<AssignGamesJobResult> => {
  const startedAt = new Date();

  const unassignedEntries = await db
    .select({
      content: patchEntries.content,
      id: patchEntries.id,
      sourceId: patchEntries.sourceId,
      title: patchEntries.title,
    })
    .from(patchEntries)
    .where(isNull(patchEntries.gameId));

  if (unassignedEntries.length === 0) {
    const finishedAt = new Date();
    return {
      status: "completed",
      assignedEntries: 0,
      processedEntries: 0,
      skippedEntries: 0,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
    };
  }

  const uniqueSourceIds = [...new Set(unassignedEntries.map((entry) => entry.sourceId))];

  const sourceRows = await db
    .select({ id: sources.id, key: sources.key, config: sources.config })
    .from(sources)
    .where(inArray(sources.id, uniqueSourceIds));

  const sourceById = new Map(
    sourceRows.map((sourceRow) => [sourceRow.id, { key: sourceRow.key, config: sourceRow.config }]),
  );

  const gameRows = await db.select({ key: games.key, id: games.id }).from(games);
  const gameIdByGameKey = new Map(
    gameRows.map((gameRow) => [normalizeText(gameRow.key), gameRow.id]),
  );
  const knownGameKeys = [...gameIdByGameKey.keys()];

  let assignedEntries = 0;
  let skippedEntries = 0;

  for (const entry of unassignedEntries) {
    const source = sourceById.get(entry.sourceId);
    const sourceKey = source?.key;
    const sourceConfig = source?.config;

    const gameKey =
      (sourceKey ? inferGameKeyFromSourceKey({ knownGameKeys, sourceKey }) : null) ||
      inferGameKeyFromText({ content: entry.content, title: entry.title });

    if (!gameKey) {
      skippedEntries += 1;
      continue;
    }

    const gameId = gameIdByGameKey.get(gameKey);

    if (!gameId) {
      skippedEntries += 1;
      continue;
    }

    const [updated] = await db
      .update(patchEntries)
      .set({ gameId })
      .where(and(eq(patchEntries.id, entry.id), isNull(patchEntries.gameId)))
      .returning({
        id: patchEntries.id,
        content: patchEntries.content,
        gameId: patchEntries.gameId,
        sourceId: patchEntries.sourceId,
        url: patchEntries.url,
      });

    if (updated) {
      assignedEntries += 1;
      try {
        await processNewPatchEntry({ newPatchEntry: updated, db, sourceConfig });
      } catch (error) {
        console.error(
          `[ingest] post-assign processing failed patchEntryId=${updated.id} sourceId=${updated.sourceId} url=${updated.url}`,
          error,
        );
      }
    } else {
      skippedEntries += 1;
    }
  }

  const finishedAt = new Date();

  return {
    status: "completed",
    assignedEntries,
    processedEntries: unassignedEntries.length,
    skippedEntries,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
  };
};
