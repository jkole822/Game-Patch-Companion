import type { htmlSourceConfigSchema } from "@shared/schemas";

export type DiscoveredItem = {
  content: string;
  publishedAt: Date | null;
  raw: string;
  title: string;
  url: string;
};

export type HtmlSourceConfig = ReturnType<typeof htmlSourceConfigSchema.parse>;
export type StructuredLine = { path: string[]; text: string };
