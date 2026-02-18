import { z } from "zod";

export const gameConflictSchema = z.object({
  error: z.literal("GAME_KEY_ALREADY_EXISTS"),
  message: z.string(),
});

export const gameNotFoundConflictSchema = z.object({
  error: z.literal("GAME_NOT_FOUND"),
  message: z.string(),
});

export const gameInUseConflictSchema = z.object({
  error: z.literal("GAME_IN_USE"),
  message: z.string(),
});
