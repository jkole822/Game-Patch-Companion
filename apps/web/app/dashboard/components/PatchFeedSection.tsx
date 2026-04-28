import { Button, Container } from "@/components";

import { formatDate, getSnippet } from "../dashboard.utils";

import type { PatchEntry } from "../dashboard.types";

type PatchFeedSectionProps = {
  gameTitleById: Map<string, string>;
  patchEntries: PatchEntry[];
};

export const PatchFeedSection = ({ gameTitleById, patchEntries }: PatchFeedSectionProps) => {
  return (
    <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-primary-light text-xs font-semibold tracking-[0.24em] uppercase">
            Patch feed
          </p>
          <h2 className="font-display text-3xl font-semibold text-white">Recent activity</h2>
        </div>
        <p className="text-text-muted text-sm">{patchEntries.length} newest entries</p>
      </div>

      {patchEntries.length > 0 ? (
        <div className="space-y-4">
          {patchEntries.map((entry) => (
            <article
              className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5"
              key={entry.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-primary-light text-xs font-semibold tracking-[0.22em] uppercase">
                    {entry.gameId
                      ? (gameTitleById.get(entry.gameId) ?? "Unassigned game")
                      : "General"}
                  </p>
                  <h3 className="font-display text-2xl text-white">{entry.title}</h3>
                </div>
                <p className="text-text-muted text-right text-xs tracking-[0.18em] uppercase">
                  {formatDate(entry.publishedAt ?? entry.createdAt)}
                </p>
              </div>
              <p className="text-text-muted mt-4 text-sm leading-7">{getSnippet(entry.content)}</p>
              <div className="mt-5">
                <Button href={entry.url} rel="noreferrer" target="_blank">
                  Open source patch note
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border-border text-text-muted rounded-3xl border border-dashed px-5 py-8 text-sm leading-6">
          No patch entries have been ingested yet. When the ingest job starts pulling patch notes,
          they will surface here.
        </div>
      )}
    </Container>
  );
};
