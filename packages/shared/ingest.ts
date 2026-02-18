import { z } from "zod";

export const ingestRunResponseSchema = z.object({
  status: z.literal("completed"),
  createdEntries: z.number().int().nonnegative(),
  failedSources: z.number().int().nonnegative(),
  processedSources: z.number().int().nonnegative(),
  startedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime(),
  durationMs: z.number().int().nonnegative(),
});

export const ingestAlreadyRunningConflictSchema = z.object({
  error: z.literal("INGEST_ALREADY_RUNNING"),
  message: z.string(),
});
