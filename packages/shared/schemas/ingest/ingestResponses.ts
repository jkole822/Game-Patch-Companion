import { z } from "zod";

import { NonNegativeInt } from "./ingestCommon";

export const assignGamesRunResponseSchema = z.object({
  assignedEntries: NonNegativeInt,
  durationMs: NonNegativeInt,
  processedEntries: NonNegativeInt,
  skippedEntries: NonNegativeInt,
  startedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime(),
  status: z.literal("completed"),
});

export const ingestRunResponseSchema = z.object({
  assignGames: assignGamesRunResponseSchema,
  createdEntries: NonNegativeInt,
  durationMs: NonNegativeInt,
  failedSources: NonNegativeInt,
  finishedAt: z.iso.datetime(),
  processedSources: NonNegativeInt,
  startedAt: z.iso.datetime(),
  status: z.literal("completed"),
});
