import { z } from "zod";

export const sourceConflictSchema = z.object({
  error: z.literal("SOURCE_KEY_ALREADY_EXISTS"),
  message: z.string(),
});

export const sourceNotFoundConflictSchema = z.object({
  error: z.literal("SOURCE_NOT_FOUND"),
  message: z.string(),
});

export const sourceInUseConflictSchema = z.object({
  error: z.literal("SOURCE_IN_USE"),
  message: z.string(),
});
