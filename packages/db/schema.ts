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
export const patches = pgTable(
  "patches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    game: text("game").notNull(),
    version: text("version"),
    title: text("title").notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    gameIdx: index("patches_game_idx").on(t.game),
    versionIdx: index("patches_version_idx").on(t.version),
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
    patchId: uuid("patch_id").references(() => patches.id),
    sourceId: uuid("source_id")
      .references(() => sources.id)
      .notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    checksum: text("checksum"),
    content: text("content").notNull(),
    fetchedAt: timestamp("fetched_at"),
    publishedAt: timestamp("published_at"),
    raw: text("raw"),
    state: patchEntryStateEnum("state").notNull().default("new"),
  },
  (t) => ({
    sourceUrlUnique: uniqueIndex("patch_entries_source_url_unique").on(t.sourceId, t.url),
    patchIdx: index("patch_entries_patch_idx").on(t.patchId),
  }),
);

/* Auth */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  tokenVersion: integer("token_version").notNull().default(0),
  role: userRoleEnum("role").notNull().default("user"),
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
