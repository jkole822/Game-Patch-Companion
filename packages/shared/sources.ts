import { z } from "zod";

export const sourceQuerySchema = z.object({
  baseUrl: z.string().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(["rss", "html", "api"]).optional(),
});

export const htmlSourceConfigSchema = z.object({
  contentSelector: z.string(),
  entrySelector: z.string(),
  game: z.string().optional(),
  linkSelector: z.string().default("a"),
  listPath: z.string(),
  publishedAtAttribute: z.string().default("datetime"),
  publishedAtRegex: z.string().optional(),
  publishedAtSelector: z.string().default("time[datetime]"),
  region: z.string().optional(),
  titleSelector: z.string(),
  versionRegex: z.string().optional(),
});

export const genericSourceConfigSchema = z.record(z.string(), z.unknown()).default({});

const sourceBaseInputSchema = z.object({
  baseUrl: z.string(),
  isEnabled: z.boolean(),
  key: z.string(),
  name: z.string(),
});

export const sourceInsertInputSchema = z.discriminatedUnion("type", [
  sourceBaseInputSchema.extend({
    config: z
      .unknown()
      .optional()
      .transform((value) => htmlSourceConfigSchema.parse(value ?? {})),
    type: z.literal("html"),
  }),
  sourceBaseInputSchema.extend({
    config: genericSourceConfigSchema.optional().default({}),
    type: z.literal("rss"),
  }),
  sourceBaseInputSchema.extend({
    config: genericSourceConfigSchema.optional().default({}),
    type: z.literal("api"),
  }),
]);

export const sourceUpdateInputSchema = z
  .object({
    baseUrl: z.string().optional(),
    config: z.union([htmlSourceConfigSchema, genericSourceConfigSchema]).optional(),
    isEnabled: z.boolean().optional(),
    key: z.string().optional(),
    name: z.string().optional(),
    type: z.enum(["rss", "html", "api"]).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one source field must be provided.",
  });

export const sourceParamsSchema = z.object({
  id: z.uuid(),
});

const sourceBaseResponseSchema = z.object({
  baseUrl: z.string(),
  createdAt: z.date(),
  id: z.string(),
  isEnabled: z.boolean(),
  key: z.string(),
  name: z.string(),
});

export const sourceResponseSchema = z.discriminatedUnion("type", [
  sourceBaseResponseSchema.extend({
    config: htmlSourceConfigSchema,
    type: z.literal("html"),
  }),
  sourceBaseResponseSchema.extend({
    config: genericSourceConfigSchema,
    type: z.literal("rss"),
  }),
  sourceBaseResponseSchema.extend({
    config: genericSourceConfigSchema,
    type: z.literal("api"),
  }),
]);

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
