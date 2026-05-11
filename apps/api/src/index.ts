import {
  AuthModule,
  GamesModule,
  IngestModule,
  PatchEntriesModule,
  SourcesModule,
  WatchlistItemsModule,
  WatchlistMatchesModule,
  WatchlistsModule,
} from "@api-modules";
import { dbPlugin } from "@api-utils";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const parseCorsOrigins = (value: string | undefined): string[] => {
  return (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const corsOrigins = parseCorsOrigins(process.env.CORS_ORIGINS ?? process.env.APP_URL);
const port = parsePositiveInt(process.env.PORT, 4000);

const app = new Elysia()
  .use(
    cors({
      origin: corsOrigins,
      credentials: true,
    }),
  )
  .use(dbPlugin)
  .use(AuthModule)
  .use(GamesModule)
  .use(IngestModule)
  .use(PatchEntriesModule)
  .use(SourcesModule)
  .use(WatchlistsModule)
  .use(WatchlistItemsModule)
  .use(WatchlistMatchesModule)
  .listen(port);

console.warn(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
