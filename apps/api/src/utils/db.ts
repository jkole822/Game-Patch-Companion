import { drizzle } from "@db/orm";
import * as schema from "@db/schema";
import { Elysia } from "elysia";
import { Pool } from "pg";

import { requireEnv } from "./env";

const pool = new Pool({
  connectionString: requireEnv("DATABASE_URL"),
});

export const db = drizzle({ client: pool, schema });

export type AppDb = typeof db;

export const dbPlugin = new Elysia({ name: "db" }).decorate("db", db);
