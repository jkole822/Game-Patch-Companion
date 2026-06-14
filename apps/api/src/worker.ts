import {
  startIngestResyncScheduler,
  startIngestScheduler,
  startPatchEntryDataPruneScheduler,
} from "@api-jobs";
import { db } from "@api-utils";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const isIngestJobEnabled = process.env.INGEST_JOB_ENABLED !== "false";
const ingestIntervalMs = parsePositiveInt(process.env.INGEST_INTERVAL_MS, ONE_DAY_MS);
const isIngestResyncJobEnabled = process.env.INGEST_RESYNC_JOB_ENABLED !== "false";
const ingestResyncIntervalMs = parsePositiveInt(process.env.INGEST_RESYNC_INTERVAL_MS, ONE_DAY_MS);
const isPatchEntryDataPruneJobEnabled = process.env.PATCH_ENTRY_DATA_PRUNE_ENABLED !== "false";
const patchEntryDataPruneIntervalMs = parsePositiveInt(
  process.env.PATCH_ENTRY_DATA_PRUNE_INTERVAL_MS,
  ONE_DAY_MS,
);
const patchEntryRawRetentionDays = parsePositiveInt(process.env.PATCH_ENTRY_RAW_RETENTION_DAYS, 30);

const stopSchedulers: Array<() => void> = [];

if (isIngestJobEnabled) {
  stopSchedulers.push(
    startIngestScheduler({
      db,
      intervalMs: ingestIntervalMs,
      runOnStartup: true,
    }),
  );
}

if (isIngestResyncJobEnabled) {
  stopSchedulers.push(
    startIngestResyncScheduler({
      db,
      intervalMs: ingestResyncIntervalMs,
      runOnStartup: false,
    }),
  );
}

if (isPatchEntryDataPruneJobEnabled) {
  stopSchedulers.push(
    startPatchEntryDataPruneScheduler({
      db,
      intervalMs: patchEntryDataPruneIntervalMs,
      rawRetentionDays: patchEntryRawRetentionDays,
      runOnStartup: true,
    }),
  );
}

if (stopSchedulers.length === 0) {
  console.warn("[worker] no schedulers enabled");
} else {
  console.warn(`[worker] started ${stopSchedulers.length} scheduler(s)`);
}

const stopWorker = () => {
  for (const stopScheduler of stopSchedulers) {
    stopScheduler();
  }

  process.exit(0);
};

process.on("SIGINT", stopWorker);
process.on("SIGTERM", stopWorker);
