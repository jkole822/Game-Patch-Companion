import type { sourceResponseSchema } from "@shared/schemas";
import type { z } from "zod";

export type SourceActionState = {
  error: string | null;
  success: string | null;
};

export type SourceRecord = z.infer<typeof sourceResponseSchema>;

export const INITIAL_SOURCE_ACTION_STATE: SourceActionState = {
  error: null,
  success: null,
};
