import { z } from "zod";

import { GameBaseSchema, GameRecordIdSchema } from "./gamesCommon";

export const gameQuerySchema = z.object({
  key: z.string().optional(),
  title: z.string().optional(),
});

export const gameInsertInputSchema = GameBaseSchema;

export const gameUpdateInputSchema = GameBaseSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one game field must be provided.",
  },
);

export const gameParamsSchema = z.object({
  id: GameRecordIdSchema,
});
