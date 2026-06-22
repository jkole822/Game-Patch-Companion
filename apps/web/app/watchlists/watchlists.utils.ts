import { getApiBaseUrl } from "@/lib/utils";

import type {
  WatchlistItemFormValues,
  WatchlistFormValues,
  WatchlistsPageViewModel,
} from "./watchlists.types";
import type { FetchResult, Game, Watchlist, WatchlistItem, WatchlistMatch } from "@/lib/types";

export const EMPTY_GAMES: Game[] = [];
export const EMPTY_WATCHLISTS: Watchlist[] = [];
export const EMPTY_WATCHLIST_ITEMS: WatchlistItem[] = [];
export const EMPTY_WATCHLIST_MATCHES: WatchlistMatch[] = [];

export const fetchWatchlistsResource = async <T>(
  path: string,
  cookieHeader: string,
  fallback: T,
  // Pass a TTL (seconds) for globally-shared, non-user-scoped data (e.g. games)
  // to reuse one cached response instead of re-querying the DB on every render.
  revalidateSeconds?: number,
): Promise<FetchResult<T>> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: {
        Cookie: cookieHeader,
      },
      ...(revalidateSeconds === undefined
        ? { cache: "no-store" as const }
        : { next: { revalidate: revalidateSeconds } }),
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

const getActivityTimestamp = (value: string | null | undefined) => {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const buildWatchlistsViewModel = ({
  games,
  watchlistItems,
  watchlistMatches,
  watchlists,
}: {
  games: Game[];
  watchlistItems: WatchlistItem[];
  watchlistMatches: WatchlistMatch[];
  watchlists: Watchlist[];
}): WatchlistsPageViewModel => {
  const gameTitleById = new Map(games.map((game) => [game.id, game.title]));
  const watchlistById = new Map(watchlists.map((watchlist) => [watchlist.id, watchlist]));
  const itemsByWatchlistId = new Map<string, WatchlistItem[]>();
  const matchesByWatchlistId = new Map<string, WatchlistMatch[]>();
  const watchlistsByGameId = new Map<string, Watchlist[]>();

  for (const item of watchlistItems) {
    const existingItems = itemsByWatchlistId.get(item.watchlistId) ?? [];
    existingItems.push(item);
    itemsByWatchlistId.set(item.watchlistId, existingItems);
  }

  for (const match of watchlistMatches) {
    const existingMatches = matchesByWatchlistId.get(match.watchlistId) ?? [];
    existingMatches.push(match);
    matchesByWatchlistId.set(match.watchlistId, existingMatches);
  }

  for (const watchlist of watchlists) {
    const existingWatchlists = watchlistsByGameId.get(watchlist.gameId) ?? [];
    existingWatchlists.push(watchlist);
    watchlistsByGameId.set(watchlist.gameId, existingWatchlists);
  }

  const watchlistsWithDetails = watchlists
    .map((watchlist) => {
      const matches = [...(matchesByWatchlistId.get(watchlist.id) ?? [])]
        .sort((left, right) => {
          return (
            getActivityTimestamp(right.patchEntryPublishedAt ?? right.patchEntryCreatedAt) -
            getActivityTimestamp(left.patchEntryPublishedAt ?? left.patchEntryCreatedAt)
          );
        })
        .map((match) => ({
          ...match,
          gameTitle: gameTitleById.get(watchlist.gameId) ?? "Unknown game",
        }));

      return {
        ...watchlist,
        gameTitle: gameTitleById.get(watchlist.gameId) ?? "Unknown game",
        items: [...(itemsByWatchlistId.get(watchlist.id) ?? [])].sort((left, right) =>
          left.keyword.localeCompare(right.keyword),
        ),
        matchCount: matches.length,
        matches,
        recentMatchAt:
          matches[0]?.patchEntryPublishedAt ??
          matches[0]?.patchEntryCreatedAt ??
          matches[0]?.createdAt ??
          null,
      };
    })
    .sort((left, right) => {
      if (left.matchCount !== right.matchCount) {
        return right.matchCount - left.matchCount;
      }

      if (left.items.length !== right.items.length) {
        return right.items.length - left.items.length;
      }

      return left.name.localeCompare(right.name);
    });

  const recentMatches = [...watchlistMatches]
    .sort((left, right) => {
      return (
        getActivityTimestamp(right.patchEntryPublishedAt ?? right.patchEntryCreatedAt) -
        getActivityTimestamp(left.patchEntryPublishedAt ?? left.patchEntryCreatedAt)
      );
    })
    .slice(0, 5)
    .map((match) => {
      const watchlist = watchlistById.get(match.watchlistId);
      return {
        ...match,
        gameTitle: gameTitleById.get(watchlist?.gameId ?? "") ?? "Unknown game",
      };
    });

  return {
    recentMatches,
    watchedGamesCount: watchlistsByGameId.size,
    watchlistsWithDetails,
  };
};

const getRequiredString = (formData: FormData, name: string) => {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
};

export const buildWatchlistPayload = (formData: FormData) => {
  const payload: WatchlistFormValues = {
    gameId: getRequiredString(formData, "gameId"),
    name: getRequiredString(formData, "name"),
  };

  if (!payload.name) {
    return {
      error: "Watchlist name is required.",
      payload: null,
    };
  }

  if (!payload.gameId) {
    return {
      error: "Choose a game for this watchlist.",
      payload: null,
    };
  }

  return {
    error: null,
    payload,
  };
};

export const buildWatchlistItemPayload = (formData: FormData) => {
  const payload: WatchlistItemFormValues = {
    keyword: getRequiredString(formData, "keyword"),
    watchlistId: getRequiredString(formData, "watchlistId"),
  };

  if (!payload.keyword) {
    return {
      error: "Keyword is required.",
      payload: null,
    };
  }

  if (!payload.watchlistId) {
    return {
      error: "Choose a watchlist before adding a keyword.",
      payload: null,
    };
  }

  return {
    error: null,
    payload,
  };
};
