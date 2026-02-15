import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

function findUp(filename: string, startDir: string): string | null {
  let currentDir = startDir;

  while (true) {
    const candidate = resolve(currentDir, filename);
    if (existsSync(candidate)) {
      return candidate;
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      return null;
    }
    currentDir = parentDir;
  }
}

if (!process.env.DATABASE_URL) {
  const configDir = dirname(fileURLToPath(import.meta.url));
  const envPath = findUp(".env", configDir);

  if (envPath) {
    config({ path: envPath });
  }
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: databaseUrl,
  },
});
