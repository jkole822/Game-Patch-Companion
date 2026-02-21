import * as cheerio from "cheerio";

import { extractHeadingsAndListLines } from "./extractHeadingsAndListLines";
import { extractNestedListLines } from "./extractNestedListLines";
import { extractPublishedAt } from "./extractPublishedAt";
import { htmlToMarkdown } from "./htmlToMarkdown";

import type { HtmlSourceConfig } from "@api-jobs/ingest/ingest.types";

export const fetchPatchEntryContent = async ({
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

  let content = "";
  if (config.contentFormat === "lines" && config.structureMode === "headings+lists") {
    content = JSON.stringify(extractHeadingsAndListLines($detail));
  } else if (config.contentFormat === "lines" && config.structureMode === "nestedLists") {
    content = JSON.stringify(extractNestedListLines($detail));
  } else {
    const html = $detail(config.contentSelector).first().html() || "";
    content = htmlToMarkdown(html);
  }

  const publishedAt = extractPublishedAt({ $: $detail, config });

  return { content, publishedAt, raw };
};
