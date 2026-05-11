import { BowArrow, Gamepad2, Radar, Scroll, Sparkles, Target } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button, CollectionsPageLayout } from "@/components";
import { getAuthCookieHeader, getCurrentUser } from "@/lib/auth";

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
  EMPTY_WATCHLIST_MATCHES,
  EMPTY_WATCHLISTS,
  fetchDashboardResource,
} from "./dashboard.utils";

import type { DashboardStat } from "./dashboard.types";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const authUser = await getCurrentUser(cookieStore);
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authUser || !authCookieHeader) {
    redirect("/login");
  }

  const [
    gamesResult,
    watchlistsResult,
    watchlistItemsResult,
    watchlistMatchesResult,
    patchEntriesResult,
  ] = await Promise.all([
    fetchDashboardResource("/games/find-many", authCookieHeader, EMPTY_GAMES),
    fetchDashboardResource("/watchlists/find-many", authCookieHeader, EMPTY_WATCHLISTS),
    fetchDashboardResource("/watchlist-items/find-many", authCookieHeader, EMPTY_WATCHLIST_ITEMS),
    fetchDashboardResource(
      "/watchlist-matches/find-many",
      authCookieHeader,
      EMPTY_WATCHLIST_MATCHES,
    ),
    fetchDashboardResource("/patch-entries/find-many", authCookieHeader, EMPTY_PATCH_ENTRIES),
  ]);

  if (
    gamesResult.unauthorized ||
    watchlistsResult.unauthorized ||
    watchlistItemsResult.unauthorized ||
    watchlistMatchesResult.unauthorized ||
    patchEntriesResult.unauthorized
  ) {
    redirect("/login");
  }

  const games = gamesResult.data;
  const watchlists = watchlistsResult.data;
  const watchlistItems = watchlistItemsResult.data;
  const { gameTitleById, recentPatchEntries, topGames, watchedGamesCount, watchlistsWithItems } =
    buildDashboardViewModel(
      games,
      watchlists,
      watchlistItems,
      watchlistMatchesResult.data,
      patchEntriesResult.data,
    );

  const partialData =
    !gamesResult.ok ||
    !watchlistsResult.ok ||
    !watchlistItemsResult.ok ||
    !watchlistMatchesResult.ok ||
    !patchEntriesResult.ok;

  const stats: DashboardStat[] = [
    {
      icon: Radar,
      label: "Recent patches",
      value: patchEntriesResult.data.length,
    },
    {
      icon: Scroll,
      label: "Watchlists",
      value: watchlists.length,
    },
    {
      icon: BowArrow,
      label: "Tracked keywords",
      value: watchlistItems.length,
    },
    {
      icon: Target,
      label: "Watchlist matches",
      value: watchlistMatchesResult.data.length,
    },
    {
      icon: Gamepad2,
      label: "Games covered",
      value: watchedGamesCount,
    },
  ];

  return (
    <CollectionsPageLayout
      description="Keep an eye on fresh patch notes, active watchlists, and the games your alerts are covering from one place."
      eyebrow="Control center"
      gridClassName="xl:grid-cols-[1.3fr_0.7fr]"
      headerActions={
        <div className="flex flex-wrap gap-3">
          {authUser.role === "admin" && <Button href="/admin">Admin</Button>}
          <Button href="/watchlists">Manage watchlists</Button>
          <Button href="/dashboard">Refresh feed</Button>
          <Button href="/">View landing page</Button>
        </div>
      }
      icon={Sparkles}
      leftPanelContent={<DashboardStatGrid stats={stats} />}
      partialData={partialData}
      resourceLabelPlural="dashboard"
      rightPanelContent={
        <GamesInFocusSection embedded topGames={topGames} watchedGamesCount={watchedGamesCount} />
      }
      rightPanelEyebrow="Coverage"
      rightPanelTitle="Games in focus"
      title="Dashboard"
    >
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <WatchlistsSection
          totalKeywords={watchlistItems.length}
          totalMatches={watchlistMatchesResult.data.length}
          watchlists={watchlistsWithItems}
        />
        <PatchFeedSection gameTitleById={gameTitleById} patchEntries={recentPatchEntries} />
      </section>
    </CollectionsPageLayout>
  );
}
