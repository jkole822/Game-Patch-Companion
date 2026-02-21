import { z } from "zod";

export const sourceTypeSchema = z.enum(["rss", "html", "api"]);

export const genericSourceConfigSchema = z.record(z.string(), z.unknown()).default({});

export const sourceBaseSchema = z.object({
  baseUrl: z.string(),
  isEnabled: z.boolean(),
  key: z.string(),
  name: z.string(),
});

export const htmlSourceConfigSchema = z.object({
  contentFormat: z.enum(["lines", "markdown"]),
  contentSelector: z.string(),
  entrySelector: z.string(),
  excludeTitleRegex: z.string().optional(),
  includeTitleRegex: z.string().optional(),
  linkSelector: z.string().default("a"),
  listPath: z.string(),
  publishedAtAttribute: z.string().default("datetime"),
  publishedAtRegex: z.string().optional(),
  publishedAtSelector: z.string().default("time[datetime]"),
  region: z.string().optional(),
  structureMode: z.enum(["headings+lists", "nestedLists"]).optional(),
  titleSelector: z.string(),
  versionRegex: z.string().optional(),
});
