import { Bell, FolderKanban, Gamepad2, Radar, Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button, Container } from "@/components";

import {
  DashboardStatGrid,
  GamesInFocusSection,
  PatchFeedSection,
  WatchlistsSection,
} from "./components";
import {
  buildDashboardViewModel,
  EMPTY_GAMES,
  EMPTY_PATCH_ENTRIES,
  EMPTY_WATCHLIST_ITEMS,
  EMPTY_WATCHLISTS,
  fetchDashboardResource,
} from "./dashboard.utils";

import type { DashboardStat } from "./dashboard.types";

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
  const { gameTitleById, recentPatchEntries, topGames, watchedGamesCount, watchlistsWithItems } =
    buildDashboardViewModel(games, watchlists, watchlistItems, patchEntriesResult.data);

  const partialData =
    !gamesResult.ok || !watchlistsResult.ok || !watchlistItemsResult.ok || !patchEntriesResult.ok;

  const stats: DashboardStat[] = [
    {
      icon: Radar,
      label: "Recent patches",
      value: patchEntriesResult.data.length,
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
      value: watchedGamesCount,
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

            <DashboardStatGrid stats={stats} />
          </Container>

          <GamesInFocusSection topGames={topGames} watchedGamesCount={watchedGamesCount} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <WatchlistsSection
            totalKeywords={watchlistItems.length}
            watchlists={watchlistsWithItems}
          />
          <PatchFeedSection gameTitleById={gameTitleById} patchEntries={recentPatchEntries} />
        </section>
      </div>
    </main>
  );
}
