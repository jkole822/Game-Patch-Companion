import { Container } from "@/components";

import type { TopGame } from "../dashboard.types";

type GamesInFocusSectionProps = {
  topGames: TopGame[];
  watchedGamesCount: number;
};

export const GamesInFocusSection = ({ topGames, watchedGamesCount }: GamesInFocusSectionProps) => {
  return (
    <Container className="w-full" contentClassName="space-y-5 p-7 sm:p-8">
      <div className="space-y-2">
        <p className="text-primary-light text-xs font-semibold tracking-[0.24em] uppercase">
          Coverage
        </p>
        <h2 className="font-display text-3xl font-semibold text-white">Games in focus</h2>
        <p className="text-text-muted text-sm leading-6">
          Your watchlists are currently centered around {watchedGamesCount} tracked games.
        </p>
      </div>

      {topGames.length > 0 ? (
        <div className="space-y-3">
          {topGames.slice(0, 4).map((game) => (
            <div
              className="border-border bg-surface-alt/80 rounded-3xl border px-4 py-4"
              key={game.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl text-white">{game.title}</h3>
                  <p className="text-text-muted mt-1 text-sm">
                    {game.watchlists} watchlists tracking {game.trackedKeywords} keywords
                  </p>
                </div>
                <span className="border-primary/30 bg-primary/10 text-primary-light rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-border text-text-muted rounded-3xl border border-dashed px-5 py-8 text-sm leading-6">
          No games are being watched yet. Once you create watchlists, this area will show where your
          coverage is strongest.
        </div>
      )}
    </Container>
  );
};
