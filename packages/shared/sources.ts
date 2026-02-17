import { z } from "zod";

export const sourceQuerySchema = z.object({
  baseUrl: z.string().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(["rss", "html", "api"]).optional(),
});

export const sourceInsertInputSchema = z.object({
  baseUrl: z.string(),
  config: z.record(z.string(), z.unknown()).optional().default({}),
  isEnabled: z.boolean(),
  key: z.string(),
  name: z.string(),
  type: z.enum(["rss", "html", "api"]),
});

export const sourceResponseSchema = sourceInsertInputSchema.extend({
  id: z.string(),
  createdAt: z.date(),
});

export const sourcesResponseSchema = z.array(sourceResponseSchema);

export const sourceConflictSchema = z.object({
  error: z.literal("SOURCE_KEY_ALREADY_EXISTS"),
  message: z.string(),
});
