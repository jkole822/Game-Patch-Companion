import { z } from "zod";

import {
  genericSourceConfigSchema,
  htmlSourceConfigSchema,
  sourceBaseSchema,
} from "./sourcesCommon";

const sourceBaseResponseSchema = sourceBaseSchema.extend({
  createdAt: z.date(),
  id: z.string(),
});

const htmlSourceResponseSchema = sourceBaseResponseSchema.extend({
  config: htmlSourceConfigSchema,
  type: z.literal("html"),
});

const rssSourceResponseSchema = sourceBaseResponseSchema.extend({
  config: genericSourceConfigSchema,
  type: z.literal("rss"),
});

const apiSourceResponseSchema = sourceBaseResponseSchema.extend({
  config: genericSourceConfigSchema,
  type: z.literal("api"),
});

export const sourceResponseSchema = z.discriminatedUnion("type", [
  htmlSourceResponseSchema,
  rssSourceResponseSchema,
  apiSourceResponseSchema,
]);

export const sourcesResponseSchema = z.array(sourceResponseSchema);

export const sourceDeleteResponseSchema = z.object({
  message: z.string(),
});
