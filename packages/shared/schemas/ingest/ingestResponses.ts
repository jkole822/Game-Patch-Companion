import { z } from "zod";

import { NonNegativeInt } from "./ingestCommon";

export const ingestRunResponseSchema = z.object({
  createdEntries: NonNegativeInt,
  durationMs: NonNegativeInt,
  failedSources: NonNegativeInt,
  finishedAt: z.iso.datetime(),
  processedSources: NonNegativeInt,
  startedAt: z.iso.datetime(),
  status: z.literal("completed"),
});
