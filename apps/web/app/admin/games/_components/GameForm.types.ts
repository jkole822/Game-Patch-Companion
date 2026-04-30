import type { gameResponseSchema } from "@shared/schemas";
import type { z } from "zod";

export type GameActionState = {
  error: string | null;
  success: string | null;
};

export type GameRecord = z.infer<typeof gameResponseSchema>;

export const INITIAL_GAME_ACTION_STATE: GameActionState = {
  error: null,
  success: null,
};
