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

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
