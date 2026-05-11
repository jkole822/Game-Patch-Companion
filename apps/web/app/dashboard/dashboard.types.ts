import type {
  FetchResult,
  Game,
  PatchEntry,
  Watchlist,
  WatchlistItem,
  WatchlistMatch,
} from "@/lib/types";
import type { LucideIcon } from "lucide-react";

export type WatchlistWithItems = Watchlist & {
  gameTitle: string;
  items: WatchlistItem[];
  matchCount: number;
  recentMatchAt: string | null;
};

export type TopGame = {
  id: string;
  title: string;
  trackedKeywords: number;
  watchlists: number;
};

export type DashboardStat = {
  icon: LucideIcon;
  label: string;
  value: number;
};

export type RecentWatchlistMatch = WatchlistMatch & {
  gameTitle: string;
};

export type { FetchResult, Game, PatchEntry, Watchlist, WatchlistItem, WatchlistMatch };
