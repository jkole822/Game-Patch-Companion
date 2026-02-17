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

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const patchEntryStateEnum = pgEnum("patch_entry_state", [
  "new",
  "assigned",
  "ignored",
  "error",
]);

export const patches = pgTable(
  "patches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    game: text("game").notNull(), // "wow", "diablo4", "helldivers2"
    version: text("version"), // "11.0.5" (nullable if unknown)
    title: text("title").notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    gameIdx: index("patches_game_idx").on(t.game),
    versionIdx: index("patches_version_idx").on(t.version),
  }),
);

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

    // Ingestion Tracking
    checksum: text("checksum"), // sha256 of normalized content
    content: text("content").notNull(), // cleaned markdown/plaintext
    fetchedAt: timestamp("fetched_at"),
    publishedAt: timestamp("published_at"), // from source page if present
    raw: text("raw"), // raw HTML/JSON
    state: patchEntryStateEnum("state").notNull().default("new"),
  },
  (t) => ({
    sourceUrlUnique: uniqueIndex("patch_entries_source_url_unique").on(t.sourceId, t.url),
    patchIdx: index("patch_entries_patch_idx").on(t.patchId),
  }),
);

export const sources = pgTable(
  "sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(), // "wow-retail-us", "lol", etc
    name: text("name").notNull(), // "World of Warcraft (US)"
    baseUrl: text("base_url").notNull(),
    type: text("type").notNull(), // "rss" | "html" | "api"
    isEnabled: boolean("is_enabled").default(true).notNull(),
    config: jsonb("config").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    keyUnique: uniqueIndex("sources_key_unique").on(t.key),
  }),
);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  tokenVersion: integer("token_version").notNull().default(0),
  role: userRoleEnum("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
