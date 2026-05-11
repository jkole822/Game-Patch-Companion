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
  userId: string;
};

export type WatchlistItem = {
  createdAt: string;
  id: string;
  keyword: string;
  watchlistId: string;
};

export type WatchlistMatch = {
  createdAt: string;
  id: string;
  keyword: string;
  matchText: string;
  patchEntryCreatedAt: string;
  patchEntryId: string;
  patchEntryPublishedAt: string | null;
  patchEntryTitle: string;
  patchEntryUrl: string;
  state: "added" | "removed" | "context";
  watchlistId: string;
  watchlistItemId: string;
  watchlistName: string;
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
