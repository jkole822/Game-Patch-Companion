import { drizzle } from "@db/orm";
import * as schema from "@db/schema";
import { Elysia } from "elysia";
import { Pool } from "pg";

import { requireEnv } from "./env";

const parsePoolMax = (value: string | undefined, fallback: number): number => {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

// NOTE: DATABASE_URL should point at Neon's POOLED endpoint (the host containing
// "-pooler"). Each Postgres backend on Neon consumes CPU; routing through the
// pooler keeps the number of live backends bounded under concurrent requests.
//
// `max` caps how many backends this process can open at once. Keep it modest so
// a burst of requests cannot fan out into a large number of CPU-consuming
// backends; idle ones are reclaimed after `idleTimeoutMillis`.
const pool = new Pool({
  connectionString: requireEnv("DATABASE_URL"),
  max: parsePoolMax(process.env.DB_POOL_MAX, 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

export const db = drizzle({ client: pool, schema });

export type AppDb = typeof db;

export const dbPlugin = new Elysia({ name: "db" }).decorate("db", db);
