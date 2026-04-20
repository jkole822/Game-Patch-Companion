import { Bell, FolderKanban, Gamepad2, Radar, Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button, Container } from "@/components";
import { getApiBaseUrl } from "@/lib/utils";

type Game = {
  id: string;
  key: string;
  title: string;
};

type Watchlist = {
  createdAt: string;
  gameId: string;
  id: string;
  name: string;
};

type WatchlistItem = {
  createdAt: string;
  id: string;
  keyword: string;
  watchlistId: string;
};

type PatchEntry = {
  content: string;
  createdAt: string;
  gameId: string | null;
  id: string;
  publishedAt: string | null;
  title: string;
  url: string;
};

type FetchResult<T> = {
  data: T;
  ok: boolean;
  unauthorized?: boolean;
};

const EMPTY_GAMES: Game[] = [];
const EMPTY_WATCHLISTS: Watchlist[] = [];
const EMPTY_WATCHLIST_ITEMS: WatchlistItem[] = [];
const EMPTY_PATCH_ENTRIES: PatchEntry[] = [];

const fetchDashboardResource = async <T,>(
  path: string,
  token: string,
  fallback: T,
): Promise<FetchResult<T>> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.status === 401) {
      return {
        data: fallback,
        ok: false,
        unauthorized: true,
      };
    }

    if (!response.ok) {
      return {
        data: fallback,
        ok: false,
      };
    }

    return {
      data: (await response.json()) as T,
      ok: true,
    };
  } catch {
    return {
      data: fallback,
      ok: false,
    };
  }
};

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "Awaiting published date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getActivityDate = (entry: PatchEntry) => {
  const value = entry.publishedAt ?? entry.createdAt;
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getSnippet = (content: string) => {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "No patch summary was captured for this entry yet.";
  }

  return normalized.length > 170 ? `${normalized.slice(0, 167)}...` : normalized;
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const [gamesResult, watchlistsResult, watchlistItemsResult, patchEntriesResult] =
    await Promise.all([
      fetchDashboardResource("/games/find-many", token, EMPTY_GAMES),
      fetchDashboardResource("/watchlists/find-many", token, EMPTY_WATCHLISTS),
      fetchDashboardResource("/watchlist-items/find-many", token, EMPTY_WATCHLIST_ITEMS),
      fetchDashboardResource("/patch-entries/find-many", token, EMPTY_PATCH_ENTRIES),
    ]);

  if (
    gamesResult.unauthorized ||
    watchlistsResult.unauthorized ||
    watchlistItemsResult.unauthorized ||
    patchEntriesResult.unauthorized
  ) {
    redirect("/login");
  }

  const games = gamesResult.data;
  const watchlists = watchlistsResult.data;
  const watchlistItems = watchlistItemsResult.data;
  const patchEntries = [...patchEntriesResult.data].sort((left, right) => {
    return getActivityDate(right) - getActivityDate(left);
  });

  const gameTitleById = new Map(games.map((game) => [game.id, game.title]));
  const itemsByWatchlistId = new Map<string, WatchlistItem[]>();

  for (const item of watchlistItems) {
    const existingItems = itemsByWatchlistId.get(item.watchlistId) ?? [];
    existingItems.push(item);
    itemsByWatchlistId.set(item.watchlistId, existingItems);
  }

  const watchlistsWithItems = [...watchlists]
    .sort((left, right) => {
      const leftItemCount = itemsByWatchlistId.get(left.id)?.length ?? 0;
      const rightItemCount = itemsByWatchlistId.get(right.id)?.length ?? 0;

      if (leftItemCount !== rightItemCount) {
        return rightItemCount - leftItemCount;
      }

      return left.name.localeCompare(right.name);
    })
    .map((watchlist) => ({
      ...watchlist,
      gameTitle: gameTitleById.get(watchlist.gameId) ?? "Unassigned game",
      items: (itemsByWatchlistId.get(watchlist.id) ?? []).sort((left, right) =>
        left.keyword.localeCompare(right.keyword),
      ),
    }));

  const recentPatchEntries = patchEntries.slice(0, 6);
  const watchedGames = new Set(watchlists.map((watchlist) => watchlist.gameId));
  const topGames = [...watchedGames]
    .map((gameId) => {
      const watchlistsForGame = watchlists.filter((watchlist) => watchlist.gameId === gameId);
      const trackedKeywords = watchlistsForGame.reduce((count, watchlist) => {
        return count + (itemsByWatchlistId.get(watchlist.id)?.length ?? 0);
      }, 0);

      return {
        id: gameId,
        title: gameTitleById.get(gameId) ?? "Unknown game",
        trackedKeywords,
        watchlists: watchlistsForGame.length,
      };
    })
    .sort((left, right) => {
      if (left.trackedKeywords !== right.trackedKeywords) {
        return right.trackedKeywords - left.trackedKeywords;
      }

      return right.watchlists - left.watchlists;
    });

  const partialData =
    !gamesResult.ok || !watchlistsResult.ok || !watchlistItemsResult.ok || !patchEntriesResult.ok;

  const stats = [
    {
      icon: Radar,
      label: "Recent patches",
      value: patchEntries.length,
    },
    {
      icon: FolderKanban,
      label: "Watchlists",
      value: watchlists.length,
    },
    {
      icon: Bell,
      label: "Tracked keywords",
      value: watchlistItems.length,
    },
    {
      icon: Gamepad2,
      label: "Games covered",
      value: watchedGames.size,
    },
  ];

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundImage: "url(/gpc-background.png)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(145,92,255,0.2),transparent_40%),linear-gradient(180deg,rgba(7,10,18,0.22),rgba(7,10,18,0.84))]" />
      <div className="page-margins relative flex flex-col gap-8 pt-8 pb-16 sm:pt-12">
        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl space-y-4">
                <div className="border-primary/35 bg-primary/10 text-primary-light inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.24em] uppercase">
                  <Sparkles className="size-3.5" />
                  Control center
                </div>
                <div className="space-y-3">
                  <h1 className="hs-1">Dashboard</h1>
                  <p className="text-text-muted max-w-xl text-base leading-7 sm:text-lg">
                    Keep an eye on fresh patch notes, active watchlists, and the games your alerts
                    are covering from one place.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/dashboard">Refresh feed</Button>
                <Button href="/">View landing page</Button>
              </div>
            </div>

            {partialData && (
              <div className="border-warning/45 bg-warning/10 text-text rounded-2xl border px-4 py-3 text-sm leading-6">
                Some dashboard data could not be loaded, so you may be seeing a partial snapshot.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              {stats.map(({ icon: Icon, label, value }) => (
                <div
                  className="border-border bg-surface/75 rounded-3xl border px-5 py-4 shadow-[0_18px_60px_rgba(11,14,25,0.35)]"
                  key={label}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-text-muted text-xs tracking-[0.24em] uppercase">
                      {label}
                    </span>
                    <Icon className="text-primary-light size-4" />
                  </div>
                  <p className="font-display text-4xl font-semibold tracking-tight text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </Container>

          <Container className="w-full" contentClassName="space-y-5 p-7 sm:p-8">
            <div className="space-y-2">
              <p className="text-primary-light text-xs font-semibold tracking-[0.24em] uppercase">
                Coverage
              </p>
              <h2 className="font-display text-3xl font-semibold text-white">Games in focus</h2>
              <p className="text-text-muted text-sm leading-6">
                Your watchlists are currently centered around {watchedGames.size || 0} tracked
                games.
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
                No games are being watched yet. Once you create watchlists, this area will show
                where your coverage is strongest.
              </div>
            )}
          </Container>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-primary-light text-xs font-semibold tracking-[0.24em] uppercase">
                  Watchlists
                </p>
                <h2 className="font-display text-3xl font-semibold text-white">Tracked themes</h2>
              </div>
              <p className="text-text-muted text-sm">{watchlistItems.length} total keywords</p>
            </div>

            {watchlistsWithItems.length > 0 ? (
              <div className="space-y-4">
                {watchlistsWithItems.map((watchlist) => (
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
                You do not have any watchlists yet. As soon as you start tracking keywords, they
                will show up here.
              </div>
            )}
          </Container>

          <Container className="w-full" contentClassName="space-y-6 p-7 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-primary-light text-xs font-semibold tracking-[0.24em] uppercase">
                  Patch feed
                </p>
                <h2 className="font-display text-3xl font-semibold text-white">Recent activity</h2>
              </div>
              <p className="text-text-muted text-sm">{recentPatchEntries.length} newest entries</p>
            </div>

            {recentPatchEntries.length > 0 ? (
              <div className="space-y-4">
                {recentPatchEntries.map((entry) => (
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
                    <p className="text-text-muted mt-4 text-sm leading-7">
                      {getSnippet(entry.content)}
                    </p>
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
                No patch entries have been ingested yet. When the ingest job starts pulling patch
                notes, they will surface here.
              </div>
            )}
          </Container>
        </section>
      </div>
    </main>
  );
}
