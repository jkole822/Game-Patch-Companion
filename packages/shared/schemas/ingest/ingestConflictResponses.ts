import { z } from "zod";

export const ingestAlreadyRunningConflictSchema = z.object({
  error: z.literal("INGEST_ALREADY_RUNNING"),
  message: z.string(),
});
