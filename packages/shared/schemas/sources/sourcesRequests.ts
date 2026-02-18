import { z } from "zod";

import {
  genericSourceConfigSchema,
  htmlSourceConfigSchema,
  sourceBaseSchema,
  sourceTypeSchema,
} from "./sourcesCommon";

const htmlSourceInputSchema = sourceBaseSchema.extend({
  config: z
    .unknown()
    .optional()
    .transform((value) => htmlSourceConfigSchema.parse(value ?? {})),
  type: z.literal("html"),
});

const rssSourceInputSchema = sourceBaseSchema.extend({
  config: genericSourceConfigSchema.optional().default({}),
  type: z.literal("rss"),
});

const apiSourceInputSchema = sourceBaseSchema.extend({
  config: genericSourceConfigSchema.optional().default({}),
  type: z.literal("api"),
});

export const sourceQuerySchema = z.object({
  baseUrl: z.string().optional(),
  key: z.string().optional(),
  name: z.string().optional(),
  type: sourceTypeSchema.optional(),
});

export const sourceInsertInputSchema = z.discriminatedUnion("type", [
  htmlSourceInputSchema,
  rssSourceInputSchema,
  apiSourceInputSchema,
]);

export const sourceUpdateInputSchema = z
  .object({
    baseUrl: z.string().optional(),
    config: z.union([htmlSourceConfigSchema, genericSourceConfigSchema]).optional(),
    isEnabled: z.boolean().optional(),
    key: z.string().optional(),
    name: z.string().optional(),
    type: sourceTypeSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one source field must be provided.",
  });

export const sourceParamsSchema = z.object({
  id: z.uuid(),
});
