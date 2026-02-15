import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { config } from "dotenv";

const isProduction = process.env.NODE_ENV === "production";

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

if (!isProduction) {
  const envPath = findUp(".env", process.cwd());
  if (envPath) {
    config({ path: envPath });
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}
