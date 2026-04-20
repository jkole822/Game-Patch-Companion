import { z } from "zod";

export const contentSyncAlreadyRunningConflictSchema = z.object({
  activeJob: z.enum(["ingest", "resync"]),
  error: z.literal("CONTENT_SYNC_ALREADY_RUNNING"),
  message: z.string(),
});

export const ingestAlreadyRunningConflictSchema = z.object({
  error: z.literal("INGEST_ALREADY_RUNNING"),
  message: z.string(),
});

export const ingestResyncAlreadyRunningConflictSchema = z.object({
  error: z.literal("INGEST_RESYNC_ALREADY_RUNNING"),
  message: z.string(),
});
