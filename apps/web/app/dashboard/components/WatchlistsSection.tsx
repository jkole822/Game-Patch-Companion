import { Button, Container } from "@/components";
import { formatDate } from "@/lib/utils";

import type { WatchlistWithItems } from "../dashboard.types";

type WatchlistsSectionProps = {
  totalKeywords: number;
  totalMatches: number;
  watchlists: WatchlistWithItems[];
};

export const WatchlistsSection = ({
  totalKeywords,
  totalMatches,
  watchlists,
}: WatchlistsSectionProps) => {
  return (
    <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">Watchlists</p>
          <h2 className="hs-2">Tracked themes</h2>
        </div>
        <div className="text-text-muted text-right text-sm">
          <p>{totalKeywords} total keywords</p>
          <p className="mt-1">{totalMatches} total matches</p>
        </div>
      </div>

      {watchlists.length > 0 ? (
        <div className="space-y-4">
          {watchlists.map((watchlist) => {
            const createdAtLabel = formatDate(watchlist.createdAt);

            return (
              <article
                className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5"
                key={watchlist.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="eyebrow">{watchlist.gameTitle}</p>
                    <h3 className="hs-3">{watchlist.name}</h3>
                  </div>
                  <div className="text-text-muted text-right text-xs tracking-[0.18em] uppercase">
                    <p>{watchlist.items.length} terms</p>
                    <p className="mt-2">{watchlist.matchCount} matches</p>
                    {createdAtLabel ? (
                      <p className="mt-2 tracking-normal normal-case">Created {createdAtLabel}</p>
                    ) : null}
                    {watchlist.recentMatchAt ? (
                      <p className="mt-2 tracking-normal normal-case">
                        Last match {formatDate(watchlist.recentMatchAt) ?? "recently"}
                      </p>
                    ) : null}
                  </div>
                </div>

                {watchlist.items.length > 0 ? (
                  <>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {watchlist.items.map((item) => (
                        <span
                          className="border-border bg-background/65 text-text rounded-full border px-3 py-1.5 text-sm"
                          key={item.id}
                        >
                          {item.keyword}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5">
                      <Button href={`/watchlists?watchlistId=${watchlist.id}`}>
                        Manage watchlist
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="mt-5 space-y-4">
                    <p className="text-text-muted text-sm leading-6">
                      This watchlist has been created, but no keywords have been added yet.
                    </p>
                    <Button href={`/watchlists?watchlistId=${watchlist.id}`}>Open watchlist</Button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border-border text-text-muted rounded-3xl border border-dashed px-5 py-8 text-sm leading-6">
          You do not have any watchlists yet. As soon as you start tracking keywords, they will show
          up here.
        </div>
      )}
    </Container>
  );
};
