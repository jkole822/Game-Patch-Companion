import { getApiBaseUrl } from "@/lib/utils";

import type {
  FetchResult,
  Game,
  PatchEntry,
  TopGame,
  Watchlist,
  WatchlistItem,
  WatchlistWithItems,
} from "./dashboard.types";

export const EMPTY_GAMES: Game[] = [];
export const EMPTY_WATCHLISTS: Watchlist[] = [];
export const EMPTY_WATCHLIST_ITEMS: WatchlistItem[] = [];
export const EMPTY_PATCH_ENTRIES: PatchEntry[] = [];

export const fetchDashboardResource = async <T>(
  path: string,
  cookieHeader: string,
  fallback: T,
): Promise<FetchResult<T>> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: {
        Cookie: cookieHeader,
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

const getActivityDate = (entry: PatchEntry) => {
  const value = entry.publishedAt ?? entry.createdAt;
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const getSnippet = (content: string) => {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "No patch summary was captured for this entry yet.";
  }

  return normalized.length > 170 ? `${normalized.slice(0, 167)}...` : normalized;
};

export const buildDashboardViewModel = (
  games: Game[],
  watchlists: Watchlist[],
  watchlistItems: WatchlistItem[],
  patchEntries: PatchEntry[],
) => {
  const sortedPatchEntries = [...patchEntries].sort((left, right) => {
    return getActivityDate(right) - getActivityDate(left);
  });

  const gameTitleById = new Map(games.map((game) => [game.id, game.title]));
  const itemsByWatchlistId = new Map<string, WatchlistItem[]>();
  const watchlistsByGameId = new Map<string, Watchlist[]>();

  for (const item of watchlistItems) {
    const existingItems = itemsByWatchlistId.get(item.watchlistId) ?? [];
    existingItems.push(item);
    itemsByWatchlistId.set(item.watchlistId, existingItems);
  }

  for (const watchlist of watchlists) {
    const existingWatchlists = watchlistsByGameId.get(watchlist.gameId) ?? [];
    existingWatchlists.push(watchlist);
    watchlistsByGameId.set(watchlist.gameId, existingWatchlists);
  }

  const watchlistsWithItems: WatchlistWithItems[] = [...watchlists]
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

  const topGames: TopGame[] = [...watchlistsByGameId.entries()]
    .map(([gameId, watchlistsForGame]) => {
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

  return {
    gameTitleById,
    recentPatchEntries: sortedPatchEntries.slice(0, 6),
    topGames,
    watchedGamesCount: watchlistsByGameId.size,
    watchlistsWithItems,
  };
};
