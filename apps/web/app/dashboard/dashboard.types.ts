import type { LucideIcon } from "lucide-react";

export type Game = {
  id: string;
  key: string;
  title: string;
};

export type Watchlist = {
  createdAt: string;
  gameId: string;
  id: string;
  name: string;
};

export type WatchlistItem = {
  createdAt: string;
  id: string;
  keyword: string;
  watchlistId: string;
};

export type PatchEntry = {
  content: string;
  createdAt: string;
  gameId: string | null;
  id: string;
  publishedAt: string | null;
  title: string;
  url: string;
};

export type FetchResult<T> = {
  data: T;
  ok: boolean;
  unauthorized?: boolean;
};

export type WatchlistWithItems = Watchlist & {
  gameTitle: string;
  items: WatchlistItem[];
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
