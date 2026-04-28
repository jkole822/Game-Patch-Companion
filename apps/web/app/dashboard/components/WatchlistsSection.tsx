import { Container } from "@/components";

import { formatDate } from "../dashboard.utils";

import type { WatchlistWithItems } from "../dashboard.types";

type WatchlistsSectionProps = {
  totalKeywords: number;
  watchlists: WatchlistWithItems[];
};

export const WatchlistsSection = ({ totalKeywords, watchlists }: WatchlistsSectionProps) => {
  return (
    <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-primary-light text-xs font-semibold tracking-[0.24em] uppercase">
            Watchlists
          </p>
          <h2 className="font-display text-3xl font-semibold text-white">Tracked themes</h2>
        </div>
        <p className="text-text-muted text-sm">{totalKeywords} total keywords</p>
      </div>

      {watchlists.length > 0 ? (
        <div className="space-y-4">
          {watchlists.map((watchlist) => (
            <article
              className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5"
              key={watchlist.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-primary-light text-xs font-semibold tracking-[0.22em] uppercase">
                    {watchlist.gameTitle}
                  </p>
                  <h3 className="font-display text-2xl text-white">{watchlist.name}</h3>
                </div>
                <div className="text-text-muted text-right text-xs tracking-[0.18em] uppercase">
                  <p>{watchlist.items.length} terms</p>
                  <p className="mt-2 tracking-normal normal-case">
                    Created {formatDate(watchlist.createdAt)}
                  </p>
                </div>
              </div>

              {watchlist.items.length > 0 ? (
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
              ) : (
                <p className="text-text-muted mt-5 text-sm leading-6">
                  This watchlist has been created, but no keywords have been added yet.
                </p>
              )}
            </article>
          ))}
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
