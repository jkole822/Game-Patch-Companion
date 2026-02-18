import { z } from "zod";

import { GameBaseSchema, GameRecordIdSchema } from "./gamesCommon";

export const gameResponseSchema = GameBaseSchema.extend({
  createdAt: z.date(),
  id: GameRecordIdSchema,
});

export const gamesResponseSchema = z.array(gameResponseSchema);

export const gameDeleteResponseSchema = z.object({
  message: z.string(),
});
