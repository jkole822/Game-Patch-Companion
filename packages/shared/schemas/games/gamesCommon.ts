import { z } from "zod";

export const GameRecordIdSchema = z.uuid();

export const GameBaseSchema = z.object({
  key: z.string(),
  title: z.string(),
});
