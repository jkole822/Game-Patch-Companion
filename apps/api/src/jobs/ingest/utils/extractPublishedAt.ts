import type { HtmlSourceConfig } from "@api-jobs/ingest/ingest.types";
import type * as cheerio from "cheerio";

export const extractPublishedAt = ({
  $,
  config,
}: {
  $: cheerio.CheerioAPI;
  config: HtmlSourceConfig;
}): Date | null => {
  const parseDate = (value: string | undefined): Date | null => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const selectorNode = $(config.publishedAtSelector).first();
  const selectorValue =
    selectorNode.attr(config.publishedAtAttribute) || selectorNode.text().trim() || undefined;
  const fromSelector = parseDate(selectorValue);
  if (fromSelector) return fromSelector;

  if (config.publishedAtRegex && selectorValue) {
    const matched = selectorValue.match(new RegExp(config.publishedAtRegex));
    const fromRegex = parseDate(matched?.[0]);
    if (fromRegex) return fromRegex;
  }

  const fromTime = parseDate($("time[datetime]").first().attr("datetime"));
  if (fromTime) return fromTime;

  const fromMeta =
    parseDate($('meta[property="article:published_time"]').attr("content")) ||
    parseDate($('meta[name="article:published_time"]').attr("content")) ||
    parseDate($('meta[name="publish-date"]').attr("content")) ||
    parseDate($('meta[name="date"]').attr("content"));

  if (fromMeta) return fromMeta;

  const ldJsonNodes = $('script[type="application/ld+json"]').toArray();
  for (const node of ldJsonNodes) {
    const jsonText = $(node).text().trim();
    if (!jsonText) continue;

    try {
      const parsed = JSON.parse(jsonText) as unknown;
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        if (!item || typeof item !== "object") continue;
        const candidate = "datePublished" in item ? item.datePublished : undefined;
        if (typeof candidate !== "string") continue;

        const parsedDate = parseDate(candidate);
        if (parsedDate) return parsedDate;
      }
    } catch {
      continue;
    }
  }

  return null;
};
