import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

import { AuthModule } from "./modules/auth";
import { dbPlugin } from "./utils/db";
import { requireEnv } from "./utils/env";

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  )
  .use(
    jwt({
      name: "jwt",
      secret: requireEnv("JWT_SECRET"),
    }),
  )
  .use(dbPlugin)
  .use(AuthModule)
  .listen(4000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
