import { htmlSourceConfigSchema } from "@shared/schemas";
import * as cheerio from "cheerio";

export type DiscoveredItem = {
  content: string;
  publishedAt: Date | null;
  raw: string;
  title: string;
  url: string;
};

type HtmlSourceConfig = ReturnType<typeof htmlSourceConfigSchema.parse>;

const absolutizeUrl = (baseUrl: string, urlLike: string): string => {
  if (urlLike.startsWith("http")) {
    return urlLike;
  }

  return `${baseUrl}${urlLike.startsWith("/") ? "" : "/"}${urlLike}`;
};

const extractPublishedAt = ({
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

const fetchPatchEntryContent = async ({
  config,
  url,
}: {
  config: HtmlSourceConfig;
  url: string;
}): Promise<{ content: string; publishedAt: Date | null; raw: string }> => {
  const detailResponse = await fetch(url, {
    headers: { "user-agent": "GamePatchCompanion/1.0" },
  });

  if (!detailResponse.ok) {
    throw new Error(`Detail fetch failed: ${detailResponse.status} for ${url}`);
  }

  const raw = await detailResponse.text();
  const $detail = cheerio.load(raw);

  const content = $detail(config.contentSelector).first().text().trim();
  const publishedAt = extractPublishedAt({ $: $detail, config });

  return { content, publishedAt, raw };
};

export const listRecentHtmlEntries = async ({
  baseUrl,
  config: configInput,
}: {
  baseUrl: string;
  config?: unknown;
}): Promise<DiscoveredItem[]> => {
  const config = htmlSourceConfigSchema.parse(configInput ?? {});
  const listUrl = absolutizeUrl(baseUrl, config.listPath);

  const res = await fetch(listUrl, {
    headers: { "user-agent": "GamePatchCompanion/1.0" },
  });

  if (!res.ok) throw new Error(`List fetch failed: ${res.status}`);
  const html = await res.text();

  const $ = cheerio.load(html);

  const seen = new Set<string>();
  const items: DiscoveredItem[] = [];

  const entries = $(config.entrySelector);
  const pendingFetches: Promise<DiscoveredItem | null>[] = [];

  entries.each((_, element) => {
    const href = $(element).find(config.linkSelector).attr("href");
    if (!href) return;

    const url = absolutizeUrl(baseUrl, href);
    if (seen.has(url)) return;
    seen.add(url);

    const title =
      $(element).find(config.titleSelector).first().text().trim() || $(element).text().trim();

    if (!title) return;
    const matchesVersion = config.versionRegex ? new RegExp(config.versionRegex).test(title) : true;
    const matchesPatchKeywords = /hotfixes:|update notes|patch notes/i.test(title);
    if (!matchesVersion && !matchesPatchKeywords) return;

    pendingFetches.push(
      fetchPatchEntryContent({ config, url }).then((detail) => {
        if (!detail.content) {
          return null;
        }

        return {
          content: detail.content,
          publishedAt: detail.publishedAt,
          raw: detail.raw,
          title,
          url,
        };
      }),
    );
  });

  const resolvedItems = await Promise.all(pendingFetches);

  for (const item of resolvedItems) {
    if (item) {
      items.push(item);
    }
  }

  return items;
};
