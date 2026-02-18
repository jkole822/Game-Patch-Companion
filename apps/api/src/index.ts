import { startIngestScheduler } from "@api-jobs";
import {
  AuthModule,
  GamesModule,
  IngestModule,
  PatchEntriesModule,
  SourcesModule,
} from "@api-modules";
import { db, dbPlugin } from "@api-utils";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const isIngestJobEnabled = process.env.INGEST_JOB_ENABLED !== "false";
const ingestIntervalMs = parsePositiveInt(process.env.INGEST_INTERVAL_MS, 5 * 60 * 1000);

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  )
  .use(dbPlugin)
  .use(AuthModule)
  .use(GamesModule)
  .use(IngestModule)
  .use(PatchEntriesModule)
  .use(SourcesModule)
  .listen(4000);

if (isIngestJobEnabled) {
  startIngestScheduler({
    db,
    intervalMs: ingestIntervalMs,
    runOnStartup: true,
  });
}

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
