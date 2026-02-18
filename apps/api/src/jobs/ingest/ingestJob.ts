import { sources } from "@db/schema";
import { sourcesResponseSchema } from "@shared/sources";
import { eq } from "drizzle-orm";

import { ingestLoop } from "./utils";

import type { AppDb } from "@api-utils";

export type IngestJobResult =
  | {
      status: "completed";
      createdEntries: number;
      failedSources: number;
      processedSources: number;
      startedAt: string;
      finishedAt: string;
      durationMs: number;
    }
  | {
      status: "skipped";
      reason: "ALREADY_RUNNING";
      message: string;
    };

let isIngestRunning = false;

export const runIngestJob = async ({ db }: { db: AppDb }): Promise<IngestJobResult> => {
  if (isIngestRunning) {
    return {
      status: "skipped",
      reason: "ALREADY_RUNNING",
      message: "Ingest job is already running.",
    };
  }

  isIngestRunning = true;
  const startedAt = new Date();

  try {
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

    const enabledSources = sourcesResponseSchema.parse(enabledSourcesRows);
    const result = await ingestLoop({ db, enabledSources });

    const finishedAt = new Date();

    return {
      status: "completed",
      createdEntries: result.createdEntries,
      failedSources: result.failedSources,
      processedSources: result.processedSources,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
    };
  } finally {
    isIngestRunning = false;
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
        console.log(
          `[ingest] completed processed=${result.processedSources} created=${result.createdEntries} failed=${result.failedSources} durationMs=${result.durationMs}`,
        );
      } else {
        console.log("[ingest] skipped: already running");
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
