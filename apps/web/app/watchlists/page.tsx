import { Bell, FolderKanban, Gamepad2, PencilLine, Plus, Radar, Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button, CollectionsPageLayout, Container } from "@/components";
import { getAuthCookieHeader, getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

import { DeleteActionModal } from "./_components/DeleteActionModal";
import { WatchlistDrawerForm } from "./_components/WatchlistDrawerForm";
import { WatchlistItemDrawerForm } from "./_components/WatchlistItemDrawerForm";
import {
  createWatchlistAction,
  createWatchlistItemAction,
  deleteWatchlistAction,
  deleteWatchlistItemAction,
  updateWatchlistAction,
  updateWatchlistItemAction,
} from "./actions";
import {
  buildWatchlistsViewModel,
  EMPTY_GAMES,
  EMPTY_WATCHLIST_ITEMS,
  EMPTY_WATCHLIST_MATCHES,
  EMPTY_WATCHLISTS,
  fetchWatchlistsResource,
} from "./watchlists.utils";

import type { WatchlistWithDetails } from "./watchlists.types";
import type { DashboardStat } from "../dashboard/dashboard.types";

const DashboardStatGrid = ({ stats }: { stats: DashboardStat[] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          className="border-border bg-surface/75 rounded-3xl border px-5 py-4 shadow-[0_18px_60px_rgba(11,14,25,0.35)]"
          key={label}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-text-muted text-xs tracking-[0.24em] uppercase">{label}</span>
            <Icon className="text-primary-light size-4" />
          </div>
          <p className="font-display text-4xl font-semibold tracking-tight text-white">{value}</p>
        </div>
      ))}
    </div>
  );
};

const getMatchBadgeClassName = (state: WatchlistWithDetails["matches"][number]["state"]) => {
  if (state === "added") {
    return "border-success/40 bg-success/10 text-success";
  }

  if (state === "removed") {
    return "border-danger/40 bg-danger/10 text-danger";
  }

  return "border-border bg-background/60 text-text-muted";
};

export default async function WatchlistsPage({
  searchParams,
}: {
  searchParams: Promise<{ watchlistId?: string }>;
}) {
  const cookieStore = await cookies();
  const authUser = await getCurrentUser(cookieStore);
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authUser || !authCookieHeader) {
    redirect("/login");
  }

  const [gamesResult, watchlistsResult, watchlistItemsResult, watchlistMatchesResult] =
    await Promise.all([
      fetchWatchlistsResource("/games/find-many", authCookieHeader, EMPTY_GAMES),
      fetchWatchlistsResource("/watchlists/find-many", authCookieHeader, EMPTY_WATCHLISTS),
      fetchWatchlistsResource(
        "/watchlist-items/find-many",
        authCookieHeader,
        EMPTY_WATCHLIST_ITEMS,
      ),
      fetchWatchlistsResource(
        "/watchlist-matches/find-many",
        authCookieHeader,
        EMPTY_WATCHLIST_MATCHES,
      ),
    ]);

  if (
    gamesResult.unauthorized ||
    watchlistsResult.unauthorized ||
    watchlistItemsResult.unauthorized ||
    watchlistMatchesResult.unauthorized
  ) {
    redirect("/login");
  }

  const { recentMatches, watchedGamesCount, watchlistsWithDetails } = buildWatchlistsViewModel({
    games: gamesResult.data,
    watchlistItems: watchlistItemsResult.data,
    watchlistMatches: watchlistMatchesResult.data,
    watchlists: watchlistsResult.data,
  });

  const partialData =
    !gamesResult.ok ||
    !watchlistsResult.ok ||
    !watchlistItemsResult.ok ||
    !watchlistMatchesResult.ok;

  const { watchlistId } = await searchParams;
  const selectedWatchlist =
    watchlistsWithDetails.find((watchlist) => watchlist.id === watchlistId) ??
    watchlistsWithDetails[0] ??
    null;
  const nextWatchlistAfterDelete = selectedWatchlist
    ? (watchlistsWithDetails.find((watchlist) => watchlist.id !== selectedWatchlist.id)?.id ?? null)
    : null;

  const stats: DashboardStat[] = [
    {
      icon: FolderKanban,
      label: "Watchlists",
      value: watchlistsWithDetails.length,
    },
    {
      icon: Bell,
      label: "Keywords",
      value: watchlistItemsResult.data.length,
    },
    {
      icon: Radar,
      label: "Matches",
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
      description="Create focused watchlists, tune the keywords inside them, and review the patch lines that actually matched."
      eyebrow="Signal center"
      gridClassName="xl:grid-cols-[1.25fr_0.75fr]"
      headerActions={
        <div className="flex flex-wrap gap-3">
          <WatchlistDrawerForm
            action={createWatchlistAction}
            description="Pick a game, name the watchlist, and then start adding the terms you want to track."
            games={gamesResult.data}
            submitLabel="Create watchlist"
            title="New watchlist"
            trigger={
              <Button>
                <span className="inline-flex items-center gap-2">
                  <Plus size={16} />
                  Create watchlist
                </span>
              </Button>
            }
          />
          <Button href="/dashboard">Back to dashboard</Button>
        </div>
      }
      icon={Sparkles}
      leftPanelContent={<DashboardStatGrid stats={stats} />}
      partialData={partialData}
      resourceLabelPlural="watchlists"
      rightPanelContent={
        <div className="space-y-4">
          {recentMatches.length > 0 ? (
            recentMatches.map((match) => (
              <article
                className="border-border bg-surface/70 rounded-3xl border p-4"
                key={match.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="eyebrow">{match.gameTitle}</p>
                    <h3 className="hs-3">{match.patchEntryTitle}</h3>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase ${getMatchBadgeClassName(match.state)}`}
                  >
                    {match.state}
                  </span>
                </div>
                <p className="text-text-muted mt-3 text-sm leading-6">
                  Matched <span className="text-text font-semibold">{match.keyword}</span> in{" "}
                  <span className="text-text">{match.watchlistName}</span>
                </p>
                <p className="border-border bg-background/65 mt-3 rounded-2xl border px-3 py-3 text-sm leading-6 text-white">
                  {match.matchText}
                </p>
              </article>
            ))
          ) : (
            <div className="border-border text-text-muted rounded-3xl border border-dashed px-5 py-8 text-sm leading-6">
              No watchlist matches have landed yet. Once fresh patch lines hit one of your tracked
              keywords, they will appear here.
            </div>
          )}
        </div>
      }
      rightPanelEyebrow="Recent matches"
      rightPanelTitle="Alert pulse"
      title="Watchlists"
    >
      <section className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
        <Container className="w-full self-start" contentClassName="space-y-6 p-7 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="eyebrow">Watchlist roster</p>
              <h2 className="hs-2">Tracked themes</h2>
            </div>
            <p className="text-text-muted text-sm">{watchlistsWithDetails.length} total lists</p>
          </div>

          {watchlistsWithDetails.length > 0 ? (
            <div className="space-y-3">
              {watchlistsWithDetails.map((watchlist) => {
                const isSelected = selectedWatchlist?.id === watchlist.id;

                return (
                  <Link
                    className={`block rounded-[1.75rem] border px-5 py-5 transition-colors ${
                      isSelected
                        ? "border-primary-light bg-primary/12 shadow-[0_18px_60px_rgba(11,14,25,0.35)]"
                        : "border-border bg-surface/80 hover:border-primary/40"
                    }`}
                    href={`/watchlists?watchlistId=${watchlist.id}`}
                    key={watchlist.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <p className="eyebrow">{watchlist.gameTitle}</p>
                        <h3 className="hs-3">{watchlist.name}</h3>
                      </div>
                      <div className="text-text-muted text-right text-xs tracking-[0.18em] uppercase">
                        <p>{watchlist.items.length} keywords</p>
                        <p className="mt-2">{watchlist.matchCount} matches</p>
                      </div>
                    </div>

                    <p className="text-text-muted mt-4 text-sm leading-6">
                      {watchlist.recentMatchAt
                        ? `Last match ${formatDate(watchlist.recentMatchAt) ?? "recently"}`
                        : "No matches yet"}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="border-border text-text-muted rounded-3xl border border-dashed px-5 py-8 text-sm leading-6">
              You do not have any watchlists yet. Create one to start tracking patch note themes for
              a specific game.
            </div>
          )}
        </Container>

        <Container className="w-full self-start" contentClassName="space-y-6 p-7 sm:p-8">
          {selectedWatchlist ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="eyebrow">{selectedWatchlist.gameTitle}</p>
                  <h2 className="hs-2">{selectedWatchlist.name}</h2>
                  <p className="text-text-muted text-sm">
                    Created {formatDate(selectedWatchlist.createdAt) ?? "recently"} with{" "}
                    {selectedWatchlist.items.length} tracked keywords.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <WatchlistDrawerForm
                    action={updateWatchlistAction.bind(null, selectedWatchlist.id)}
                    description="Update the watchlist name or move it onto a different game."
                    games={gamesResult.data}
                    initialValues={{
                      gameId: selectedWatchlist.gameId,
                      name: selectedWatchlist.name,
                    }}
                    submitLabel="Save watchlist"
                    title="Edit watchlist"
                    trigger={
                      <Button>
                        <span className="inline-flex items-center gap-2">
                          <PencilLine size={16} />
                          Edit watchlist
                        </span>
                      </Button>
                    }
                  />
                  <DeleteActionModal
                    action={deleteWatchlistAction.bind(
                      null,
                      selectedWatchlist.id,
                      nextWatchlistAfterDelete,
                    )}
                    description="This removes the watchlist, all of its tracked keywords, and its saved matches."
                    itemName={selectedWatchlist.name}
                    resourceLabel="watchlist"
                  />
                </div>
              </div>

              <section className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="space-y-2">
                    <p className="eyebrow">Keywords</p>
                    <h3 className="hs-3">Tracked terms</h3>
                  </div>
                  <WatchlistItemDrawerForm
                    action={createWatchlistItemAction}
                    description="Add a new keyword to this watchlist. Matching is currently case-insensitive substring search."
                    initialValues={{ watchlistId: selectedWatchlist.id }}
                    submitLabel="Add keyword"
                    title="New keyword"
                    trigger={
                      <Button>
                        <span className="inline-flex items-center gap-2">
                          <Plus size={16} />
                          Add keyword
                        </span>
                      </Button>
                    }
                  />
                </div>

                {selectedWatchlist.items.length > 0 ? (
                  <div className="space-y-3">
                    {selectedWatchlist.items.map((item) => (
                      <article
                        className="border-border bg-surface/70 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border px-4 py-4"
                        key={item.id}
                      >
                        <div className="space-y-2">
                          <p className="font-mono text-sm text-white">{item.keyword}</p>
                          <p className="text-text-muted text-xs">
                            Added {formatDate(item.createdAt) ?? "recently"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <WatchlistItemDrawerForm
                            action={updateWatchlistItemAction.bind(
                              null,
                              item.id,
                              selectedWatchlist.id,
                            )}
                            description="Refine the keyword text for this watchlist."
                            initialValues={{
                              keyword: item.keyword,
                              watchlistId: selectedWatchlist.id,
                            }}
                            submitLabel="Save keyword"
                            title="Edit keyword"
                            trigger={<Button>Edit keyword</Button>}
                          />
                          <DeleteActionModal
                            action={deleteWatchlistItemAction.bind(
                              null,
                              item.id,
                              selectedWatchlist.id,
                            )}
                            itemName={item.keyword}
                            resourceLabel="keyword"
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="border-border text-text-muted rounded-3xl border border-dashed px-5 py-8 text-sm leading-6">
                    This watchlist is ready, but it does not have any keywords yet. Add terms like a
                    class name, mechanic, item, or feature you care about.
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <div className="space-y-2">
                  <p className="eyebrow">Matches</p>
                  <h3 className="hs-3">Patch lines that hit this watchlist</h3>
                </div>

                {selectedWatchlist.matches.length > 0 ? (
                  <div className="space-y-4">
                    {selectedWatchlist.matches.map((match) => (
                      <article
                        className="border-border bg-surface/80 rounded-[1.75rem] border px-5 py-5"
                        key={match.id}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-2">
                            <p className="eyebrow">{match.patchEntryTitle}</p>
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-2.5 py-1 text-xs font-semibold uppercase ${getMatchBadgeClassName(match.state)}`}
                              >
                                {match.state}
                              </span>
                              <span className="border-border bg-background/65 rounded-full border px-2.5 py-1 text-xs font-medium text-white">
                                {match.keyword}
                              </span>
                            </div>
                          </div>
                          <p className="text-text-muted text-right text-xs tracking-[0.18em] uppercase">
                            {formatDate(match.patchEntryPublishedAt ?? match.patchEntryCreatedAt)}
                          </p>
                        </div>
                        <p className="border-border bg-background/65 mt-4 rounded-2xl border px-4 py-4 text-sm leading-7 text-white">
                          {match.matchText}
                        </p>
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                          <p className="text-text-muted text-sm">
                            Matched inside <span className="text-text">{match.watchlistName}</span>
                          </p>
                          <Button href={match.patchEntryUrl} target="_blank">
                            Open source patch note
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="border-border text-text-muted rounded-3xl border border-dashed px-5 py-8 text-sm leading-6">
                    No patch lines have matched this watchlist yet. Once one of these keywords
                    appears in an added or removed line, it will surface here.
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="eyebrow">Watchlist detail</p>
                <h2 className="hs-2">Nothing selected yet</h2>
              </div>
              <p className="text-text-muted text-sm leading-7">
                Start by creating your first watchlist. Each one belongs to a single game and holds
                the keywords you want to scan for in patch note diffs.
              </p>
            </div>
          )}
        </Container>
      </section>
    </CollectionsPageLayout>
  );
}
