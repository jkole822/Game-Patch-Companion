import { patchEntries } from "@db/schema";

import { listRecentHtmlEntries } from "./listRecentHtmlEntries";

import type { AppDb } from "@api-utils/db";
import type { sourcesResponseSchema } from "@shared/schemas";
import type { z } from "zod";

type Sources = z.infer<typeof sourcesResponseSchema>;

export type IngestLoopResult = {
  processedSources: number;
  failedSources: number;
  createdEntries: number;
};

const sha256 = (value: string): string =>
  new Bun.CryptoHasher("sha256").update(value).digest("hex");

export const ingestLoop = async ({
  db,
  enabledSources,
}: {
  db: AppDb;
  enabledSources: Sources;
}): Promise<IngestLoopResult> => {
  let processedSources = 0;
  let failedSources = 0;
  let createdEntries = 0;

  for (const source of enabledSources) {
    if (!source.isEnabled) {
      continue;
    }

    const sourceConfig =
      typeof source.config === "object" && source.config !== null ? source.config : {};

    switch (source.type) {
      case "html":
        try {
          const discoveredEntries = await listRecentHtmlEntries({
            baseUrl: source.baseUrl,
            config: sourceConfig,
          });

          if (discoveredEntries.length === 0) {
            processedSources += 1;
            break;
          }

          const inserted = await db
            .insert(patchEntries)
            .values(
              discoveredEntries.map((entry) => ({
                checksum: sha256(entry.content),
                content: entry.content,
                fetchedAt: new Date(),
                publishedAt: entry.publishedAt,
                raw: entry.raw,
                sourceId: source.id,
                title: entry.title,
                url: entry.url,
              })),
            )
            .onConflictDoNothing({
              target: [patchEntries.sourceId, patchEntries.url],
            })
            .returning({
              id: patchEntries.id,
            });

          createdEntries += inserted.length;
          processedSources += 1;
        } catch (error) {
          failedSources += 1;
          console.error(
            `[ingest] source failed id=${source.id} key=${source.key} type=${source.type} baseUrl=${source.baseUrl}`,
            error,
          );
        }

        break;
      case "rss":
        processedSources += 1;
        break;
      case "api":
        processedSources += 1;
        break;
    }
  }

  return {
    createdEntries,
    failedSources,
    processedSources,
  };
};
