import { patchEntries, patchEntryDiffs, sources, watchlistMatches } from "@db/schema";
import { sourcesResponseSchema } from "@shared/schemas";
import { eq } from "drizzle-orm";

import { assignGames, ingestLoop } from "./utils";
import { fetchPatchEntryContent } from "./utils/fetchPatchEntryContent";
import { processNewPatchEntry } from "./utils/processNewPatchEntry";

import type { AssignGamesJobResult } from "./utils";
import type { AppDb } from "@api-utils";
import type { sourceResponseSchema } from "@shared/schemas";
import type { z } from "zod";

export type IngestJobResult =
  | {
      status: "completed";
      createdEntries: number;
      failedSources: number;
      processedSources: number;
      assignGames: AssignGamesJobResult;
      startedAt: string;
      finishedAt: string;
      durationMs: number;
    }
  | {
      status: "skipped";
      reason: "ALREADY_RUNNING";
      message: string;
    };

export type IngestResyncJobResult =
  | {
      status: "completed";
      checkedEntries: number;
      failedEntries: number;
      processedSources: number;
      updatedEntries: number;
      assignGames: AssignGamesJobResult;
      startedAt: string;
      finishedAt: string;
      durationMs: number;
    }
  | {
      status: "skipped";
      reason: "ALREADY_RUNNING";
      message: string;
    };

type EnabledSource = z.infer<typeof sourceResponseSchema>;
type ActiveContentSyncJob = "ingest" | "resync" | null;

let activeContentSyncJob: ActiveContentSyncJob = null;

const sha256 = (value: string): string =>
  new Bun.CryptoHasher("sha256").update(value).digest("hex");

const acquireContentSyncJob = (
  job: Exclude<ActiveContentSyncJob, null>,
): { ok: true } | { ok: false; message: string } => {
  if (activeContentSyncJob) {
    return {
      ok: false,
      message: `${activeContentSyncJob} job is already running.`,
    };
  }

  activeContentSyncJob = job;

  return { ok: true };
};

const releaseContentSyncJob = () => {
  activeContentSyncJob = null;
};

const getEnabledSources = async ({ db }: { db: AppDb }): Promise<EnabledSource[]> => {
  const enabledSourcesRows = await db
    .select({
      baseUrl: sources.baseUrl,
      config: sources.config,
      createdAt: sources.createdAt,
      id: sources.id,
      isEnabled: sources.isEnabled,
      key: sources.key,
      name: sources.name,
      type: sources.type,
    })
    .from(sources)
    .where(eq(sources.isEnabled, true));

  return sourcesResponseSchema.parse(enabledSourcesRows);
};

export const runIngestJob = async ({ db }: { db: AppDb }): Promise<IngestJobResult> => {
  const lock = acquireContentSyncJob("ingest");

  if (!lock.ok) {
    return {
      status: "skipped",
      reason: "ALREADY_RUNNING",
      message: lock.message,
    };
  }

  const startedAt = new Date();

  try {
    const enabledSources = await getEnabledSources({ db });
    const result = await ingestLoop({ db, enabledSources });
    const assignedGames = await assignGames({ db });

    const finishedAt = new Date();

    return {
      status: "completed",
      createdEntries: result.createdEntries,
      failedSources: result.failedSources,
      processedSources: result.processedSources,
      assignGames: assignedGames,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
    };
  } finally {
    releaseContentSyncJob();
  }
};

export const runIngestResyncJob = async ({ db }: { db: AppDb }): Promise<IngestResyncJobResult> => {
  const lock = acquireContentSyncJob("resync");

  if (!lock.ok) {
    return {
      status: "skipped",
      reason: "ALREADY_RUNNING",
      message: lock.message,
    };
  }

  const startedAt = new Date();

  try {
    const enabledSources = await getEnabledSources({ db });
    let processedSources = 0;
    let checkedEntries = 0;
    let updatedEntries = 0;
    let failedEntries = 0;

    for (const source of enabledSources) {
      if (source.type !== "html") {
        processedSources += 1;
        continue;
      }

      const existingEntries = await db
        .select({
          checksum: patchEntries.checksum,
          content: patchEntries.content,
          createdAt: patchEntries.createdAt,
          gameId: patchEntries.gameId,
          id: patchEntries.id,
          publishedAt: patchEntries.publishedAt,
          raw: patchEntries.raw,
          sourceId: patchEntries.sourceId,
          title: patchEntries.title,
          url: patchEntries.url,
        })
        .from(patchEntries)
        .where(eq(patchEntries.sourceId, source.id));

      for (const entry of existingEntries) {
        checkedEntries += 1;

        try {
          const next = await fetchPatchEntryContent({
            config: source.config,
            url: entry.url,
          });

          const nextChecksum = sha256(next.content);
          const hasChanged =
            nextChecksum !== entry.checksum ||
            next.content !== entry.content ||
            next.raw !== entry.raw ||
            next.publishedAt?.getTime() !== entry.publishedAt?.getTime();

          if (!hasChanged) {
            continue;
          }

          const [updatedEntry] = await db
            .update(patchEntries)
            .set({
              checksum: nextChecksum,
              content: next.content,
              fetchedAt: new Date(),
              publishedAt: next.publishedAt,
              raw: next.raw,
            })
            .where(eq(patchEntries.id, entry.id))
            .returning({
              content: patchEntries.content,
              gameId: patchEntries.gameId,
              id: patchEntries.id,
              sourceId: patchEntries.sourceId,
              url: patchEntries.url,
            });

          if (!updatedEntry) {
            continue;
          }

          await db.delete(patchEntryDiffs).where(eq(patchEntryDiffs.patchEntryId, updatedEntry.id));
          await db
            .delete(watchlistMatches)
            .where(eq(watchlistMatches.patchEntryId, updatedEntry.id));

          await processNewPatchEntry({
            db,
            newPatchEntry: updatedEntry,
            previousContent: entry.content,
            sourceConfig: source.config,
          });

          updatedEntries += 1;
        } catch (error) {
          failedEntries += 1;
          console.error(
            `[ingest-resync] entry failed patchEntryId=${entry.id} sourceId=${entry.sourceId} url=${entry.url}`,
            error,
          );
        }
      }

      processedSources += 1;
    }

    const assignedGames = await assignGames({ db });
    const finishedAt = new Date();

    return {
      status: "completed",
      assignGames: assignedGames,
      checkedEntries,
      failedEntries,
      processedSources,
      updatedEntries,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
    };
  } finally {
    releaseContentSyncJob();
  }
};

export const startIngestScheduler = ({
  db,
  intervalMs,
  runOnStartup,
}: {
  db: AppDb;
  intervalMs: number;
  runOnStartup: boolean;
}): (() => void) => {
  const run = async () => {
    try {
      const result = await runIngestJob({ db });

      if (result.status === "completed") {
        console.warn(
          `[ingest] completed processed=${result.processedSources} created=${result.createdEntries} failed=${result.failedSources} assignedGames=${result.assignGames.assignedEntries} durationMs=${result.durationMs}`,
        );
      } else {
        console.warn("[ingest] skipped: already running");
      }
    } catch (error) {
      console.error("[ingest] run failed", error);
    }
  };

  if (runOnStartup) {
    void run();
  }

  const timer = setInterval(() => {
    void run();
  }, intervalMs);

  return () => clearInterval(timer);
};

export const startIngestResyncScheduler = ({
  db,
  intervalMs,
  runOnStartup,
}: {
  db: AppDb;
  intervalMs: number;
  runOnStartup: boolean;
}): (() => void) => {
  const run = async () => {
    try {
      const result = await runIngestResyncJob({ db });

      if (result.status === "completed") {
        console.warn(
          `[ingest-resync] completed processedSources=${result.processedSources} checked=${result.checkedEntries} updated=${result.updatedEntries} failed=${result.failedEntries} assignedGames=${result.assignGames.assignedEntries} durationMs=${result.durationMs}`,
        );
      } else {
        console.warn(`[ingest-resync] skipped: ${result.message}`);
      }
    } catch (error) {
      console.error("[ingest-resync] run failed", error);
    }
  };

  if (runOnStartup) {
    void run();
  }

  const timer = setInterval(() => {
    void run();
  }, intervalMs);

  return () => clearInterval(timer);
};
