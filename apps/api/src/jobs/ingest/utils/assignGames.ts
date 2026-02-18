import { games, patchEntries, sources } from "@db/schema";
import { and, eq, inArray, isNull } from "drizzle-orm";

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

const inferGameKeyFromSourceConfig = (config: Record<string, unknown>): string | null => {
  const rawGame = config.game;
  return typeof rawGame === "string" && rawGame.trim() ? normalizeText(rawGame) : null;
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
    .select({ config: sources.config, id: sources.id })
    .from(sources)
    .where(inArray(sources.id, uniqueSourceIds));

  const sourceConfigById = new Map(sourceRows.map((sourceRow) => [sourceRow.id, sourceRow.config]));

  const gameRows = await db.select({ key: games.key, id: games.id }).from(games);
  const gameIdByGameKey = new Map(
    gameRows.map((gameRow) => [normalizeText(gameRow.key), gameRow.id]),
  );

  let assignedEntries = 0;
  let skippedEntries = 0;

  for (const entry of unassignedEntries) {
    const sourceConfigRaw = sourceConfigById.get(entry.sourceId);
    const sourceConfig =
      typeof sourceConfigRaw === "object" && sourceConfigRaw !== null
        ? (sourceConfigRaw as Record<string, unknown>)
        : {};

    const gameKey =
      inferGameKeyFromSourceConfig(sourceConfig) ||
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
      .returning({ id: patchEntries.id });

    if (updated) {
      assignedEntries += 1;
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
