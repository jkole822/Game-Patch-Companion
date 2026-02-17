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

export const sourceUpdateInputSchema = sourceInsertInputSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one source field must be provided.",
  });

export const sourceParamsSchema = z.object({
  id: z.uuid(),
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

export const sourceNotFoundConflictSchema = z.object({
  error: z.literal("SOURCE_NOT_FOUND"),
  message: z.string(),
});

export const sourceInUseConflictSchema = z.object({
  error: z.literal("SOURCE_IN_USE"),
  message: z.string(),
});

export const sourceDeleteResponseSchema = z.object({
  message: z.string(),
});
