import { startIngestResyncScheduler, startIngestScheduler } from "@api-jobs";
import { db } from "@api-utils";

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const isIngestJobEnabled = process.env.INGEST_JOB_ENABLED !== "false";
const ingestIntervalMs = parsePositiveInt(process.env.INGEST_INTERVAL_MS, 5 * 60 * 1000);
const isIngestResyncJobEnabled = process.env.INGEST_RESYNC_JOB_ENABLED !== "false";
const ingestResyncIntervalMs = parsePositiveInt(
  process.env.INGEST_RESYNC_INTERVAL_MS,
  60 * 60 * 1000,
);

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

if (stopSchedulers.length === 0) {
  console.warn("[worker] no ingest schedulers enabled");
} else {
  console.warn(`[worker] started ${stopSchedulers.length} ingest scheduler(s)`);
}

const stopWorker = () => {
  for (const stopScheduler of stopSchedulers) {
    stopScheduler();
  }

  process.exit(0);
};

process.on("SIGINT", stopWorker);
process.on("SIGTERM", stopWorker);
