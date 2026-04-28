import type { HtmlSourceConfig } from "@api-jobs/ingest/ingest.types";
import type * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

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

  const parseEpoch = (value: string | undefined): Date | null => {
    if (!value || !/^\d{9,13}$/.test(value)) {
      return null;
    }

    const asNumber = Number(value);
    if (Number.isNaN(asNumber)) {
      return null;
    }

    const milliseconds = value.length >= 13 ? asNumber : asNumber * 1000;
    const date = new Date(milliseconds);

    return Number.isNaN(date.getTime()) ? null : date;
  };

  const extractEpochFromNode = (node: cheerio.Cheerio<AnyNode>): Date | null => {
    const attrEpoch =
      parseEpoch(node.attr("data-epoch")) ||
      parseEpoch(node.attr("data-timestamp")) ||
      parseEpoch(node.attr("data-unix"));

    if (attrEpoch) {
      return attrEpoch;
    }

    const scriptText = node
      .find("script")
      .toArray()
      .map((scriptNode) => $(scriptNode).text())
      .join(" ");
    const scriptEpoch = scriptText.match(/ldst_strftime(?:_dynamic_[a-z]+)?\((\d{9,13})\b/i)?.[1];

    return parseEpoch(scriptEpoch);
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

  const fromSelectorEpoch = extractEpochFromNode(selectorNode);
  if (fromSelectorEpoch) return fromSelectorEpoch;

  const fromTime = parseDate($("time[datetime]").first().attr("datetime"));
  if (fromTime) return fromTime;

  const fromTimeEpoch = extractEpochFromNode($("time").first());
  if (fromTimeEpoch) return fromTimeEpoch;

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
