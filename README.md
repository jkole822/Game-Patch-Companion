# game-patch-companion

To install dependencies:

```bash
bun install
```

## Environment Files

Before running the app, add both required environment files:

- Create a root `.env` file at `/Users/kole/Code/Clients/Game-Patch-Companion/.env`
- Create a web `.env.local` file at `/Users/kole/Code/Clients/Game-Patch-Companion/apps/web/.env.local`

## Local Postgres (Docker)

Start PostgreSQL:

```bash
bun run db:up
```

Use this local connection string:

```bash
DATABASE_URL=postgresql://game_patch_companion:game_patch_companion@localhost:5432/game_patch_companion
```

Apply schema changes:

```bash
bun run drizzle:push
```

Stop PostgreSQL:

```bash
bun run db:down
```

To run the app:

```bash
bun run dev
```

## Ingest Worker

The ingest worker defaults to a daily cadence:

```bash
INGEST_INTERVAL_MS=86400000
INGEST_RESYNC_INTERVAL_MS=86400000
```

Patch entry raw HTML is pruned daily by default after 30 days. This keeps patch metadata,
normalized content, checksums, and URLs intact while removing the bulkier debug copy:

```bash
PATCH_ENTRY_DATA_PRUNE_ENABLED=true
PATCH_ENTRY_DATA_PRUNE_INTERVAL_MS=86400000
PATCH_ENTRY_RAW_RETENTION_DAYS=30
```

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
