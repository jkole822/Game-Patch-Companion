import { htmlSourceConfigSchema } from "@shared/schemas";
import * as cheerio from "cheerio";

import { absolutizeUrl } from "./absolutizeUrl";
import { fetchPatchEntryContent } from "./fetchPatchEntryContent";

import type { DiscoveredItem } from "@api-jobs/ingest/ingest.types";

export const listRecentHtmlEntries = async ({
  baseUrl,
  config: configInput,
}: {
  baseUrl: string;
  config?: unknown;
}): Promise<DiscoveredItem[]> => {
  const config = htmlSourceConfigSchema.parse(configInput ?? {});
  const regionUrl = absolutizeUrl(baseUrl, config.region);
  const listUrl = absolutizeUrl(regionUrl, config.listPath);

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
    const matchesPatchKeywords = config.includeTitleRegex
      ? new RegExp(config.includeTitleRegex, "i").test(title)
      : true;
    const matchesExcludedPatchKeywords = config.excludeTitleRegex
      ? new RegExp(config.excludeTitleRegex, "i").test(title)
      : false;

    if ((!matchesVersion && !matchesPatchKeywords) || matchesExcludedPatchKeywords) return;

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
