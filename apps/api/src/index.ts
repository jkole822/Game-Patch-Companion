import { AuthModule } from "@api-modules";
import { dbPlugin } from "@api-utils";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  )
  .use(dbPlugin)
  .use(AuthModule)
  .listen(4000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
