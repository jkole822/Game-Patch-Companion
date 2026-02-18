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
export const patchEntryStateEnum = pgEnum("patch_entry_state", [
  "new",
  "assigned",
  "ignored",
  "error",
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    fetchedAt: timestamp("fetched_at"),
    publishedAt: timestamp("published_at"),
    raw: text("raw"),
    title: text("title").notNull(),
    url: text("url").notNull(),
  },
  (t) => ({
    sourceUrlUnique: uniqueIndex("patch_entries_source_url_unique").on(t.sourceId, t.url),
    gameIdx: index("patch_entries_game_idx").on(t.gameId),
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
export const watchlists = pgTable("watchlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchlistItems = pgTable("watchlist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  watchlistId: uuid("watchlist_id")
    .references(() => watchlists.id, { onDelete: "cascade" })
    .notNull(),
  keyword: text("keyword").notNull(),
});
