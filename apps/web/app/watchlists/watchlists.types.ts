import type { Game, Watchlist, WatchlistItem, WatchlistMatch } from "@/lib/types";
import type { ReactNode } from "react";

export type WatchlistsPageActionState = {
  error: string | null;
  success: string | null;
};

export const INITIAL_WATCHLISTS_PAGE_ACTION_STATE: WatchlistsPageActionState = {
  error: null,
  success: null,
};

export type WatchlistMatchView = WatchlistMatch & {
  gameTitle: string;
};

export type WatchlistWithDetails = Watchlist & {
  gameTitle: string;
  items: WatchlistItem[];
  matchCount: number;
  matches: WatchlistMatchView[];
  recentMatchAt: string | null;
};

export type WatchlistsPageViewModel = {
  recentMatches: WatchlistMatchView[];
  watchedGamesCount: number;
  watchlistsWithDetails: WatchlistWithDetails[];
};

export type WatchlistFormValues = {
  gameId: string;
  name: string;
};

export type WatchlistItemFormValues = {
  keyword: string;
  watchlistId: string;
};

export type WatchlistFormDrawerProps = {
  action: (
    state: WatchlistsPageActionState | undefined,
    formData: FormData,
  ) => Promise<WatchlistsPageActionState>;
  description: string;
  games: Game[];
  initialValues?: Partial<WatchlistFormValues>;
  submitLabel: string;
  title: string;
  trigger: ReactNode;
};

export type WatchlistItemFormDrawerProps = {
  action: (
    state: WatchlistsPageActionState | undefined,
    formData: FormData,
  ) => Promise<WatchlistsPageActionState>;
  description: string;
  initialValues?: Partial<WatchlistItemFormValues>;
  submitLabel: string;
  title: string;
  trigger: ReactNode;
};

export type DeleteActionModalProps = {
  action: (
    state: WatchlistsPageActionState | undefined,
    formData: FormData,
  ) => Promise<WatchlistsPageActionState>;
  description?: string;
  itemName: string;
  resourceLabel: string;
  triggerLabel?: string;
};
