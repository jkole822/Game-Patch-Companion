import {
  boolean,
  integer,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* Enums */
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const watchlistMatchStateEnum = pgEnum("watchlist_match_state", [
  "context",
  "added",
  "removed",
]);

/* Core Domain */
export const games = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),
    title: text("title").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    keyIdx: index("games_key_idx").on(t.key),
  }),
);

/* Source Registry */
export const sources = pgTable(
  "sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),
    name: text("name").notNull(),
    baseUrl: text("base_url").notNull(),
    type: text("type").notNull(),
    isEnabled: boolean("is_enabled").default(true).notNull(),
    config: jsonb("config").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    keyUnique: uniqueIndex("sources_key_unique").on(t.key),
  }),
);

/* Ingested Entries */
export const patchEntries = pgTable(
  "patch_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id").references(() => games.id),
    sourceId: uuid("source_id")
      .references(() => sources.id)
      .notNull(),
    checksum: text("checksum"),
    content: text("content").notNull(),
    fetchedAt: timestamp("fetched_at"),
    publishedAt: timestamp("published_at"),
    raw: text("raw"),
    title: text("title").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    sourceUrlUnique: uniqueIndex("patch_entries_source_url_unique").on(t.sourceId, t.url),
    gameIdx: index("patch_entries_game_idx").on(t.gameId),
  }),
);

export const patchEntryDiffs = pgTable(
  "patch_entry_diffs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    patchEntryId: uuid("patch_entry_id")
      .references(() => patchEntries.id)
      .notNull(),
    added: jsonb("added").notNull(),
    removed: jsonb("removed").notNull(),
    stats: jsonb("stats").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    patchEntryIdx: index("patch_entry_diffs_patch_entry_idx").on(t.patchEntryId),
  }),
);

/* Auth */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("user"),
  tokenVersion: integer("token_version").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* User Watchlists */
export const watchlists = pgTable(
  "watchlists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    gameId: uuid("game_id")
      .references(() => games.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    gameIdx: index("watchlists_game_idx").on(t.gameId),
  }),
);

export const watchlistItems = pgTable(
  "watchlist_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    watchlistId: uuid("watchlist_id")
      .references(() => watchlists.id, { onDelete: "cascade" })
      .notNull(),
    keyword: text("keyword").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    watchlistIdx: index("watchlist_items_watchlist_idx").on(t.watchlistId),
    keywordUnique: uniqueIndex("watchlist_items_keyword_unique").on(t.keyword),
  }),
);

export const watchlistMatches = pgTable(
  "watchlist_matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    patchEntryId: uuid("patch_entry_id")
      .references(() => patchEntries.id, { onDelete: "cascade" })
      .notNull(),
    watchlistId: uuid("watchlist_id")
      .references(() => watchlists.id, { onDelete: "cascade" })
      .notNull(),
    watchlistItemId: uuid("watchlist_item_id")
      .references(() => watchlistItems.id, { onDelete: "cascade" })
      .notNull(),
    matchText: text("match_text").notNull(),
    state: watchlistMatchStateEnum().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    patchEntryIdx: index("watchlist_matches_patch_entry_idx").on(t.patchEntryId),
    watchlistIdx: index("watchlist_matches_watchlist_idx").on(t.watchlistId),
  }),
);
