import { users } from "@db/schema";
import { unauthorizedConflictSchema } from "@shared/auth";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";

import { dbPlugin } from "./db";
import { jwtPlugin } from "./jwt";

export type JwtUser = {
  id: string;
  tokenVersion: number;
};

const BEARER_PREFIX = "Bearer ";

export const authGuard = new Elysia({ name: "auth-guard" })
  .use(dbPlugin)
  .use(jwtPlugin)
  .decorate("user", null as JwtUser | null)
  .derive({ as: "scoped" }, async ({ headers, jwt, db }) => {
    const authorizationHeader = headers.authorization;

    if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
      return { user: null as JwtUser | null };
    }

    const token = authorizationHeader.slice(BEARER_PREFIX.length).trim();

    if (!token) {
      return { user: null as JwtUser | null };
    }

    const payload = await jwt.verify(token);

    if (
      !payload ||
      typeof payload !== "object" ||
      !("id" in payload) ||
      typeof payload.id !== "string" ||
      !("tokenVersion" in payload) ||
      typeof payload.tokenVersion !== "number" ||
      !Number.isInteger(payload.tokenVersion) ||
      payload.tokenVersion < 0
    ) {
      return { user: null as JwtUser | null };
    }

    const [existingUser] = await db
      .select({ id: users.id, tokenVersion: users.tokenVersion })
      .from(users)
      .where(eq(users.id, payload.id))
      .limit(1);

    if (!existingUser || existingUser.tokenVersion !== payload.tokenVersion) {
      return { user: null as JwtUser | null };
    }

    return {
      user: {
        id: payload.id,
        tokenVersion: payload.tokenVersion,
      } as JwtUser,
    };
  })
  .onBeforeHandle({ as: "scoped" }, ({ status, user }) => {
    if (!user) {
      return status(
        401,
        unauthorizedConflictSchema.parse({
          error: "UNAUTHORIZED",
          message: "Missing or invalid token.",
        }),
      );
    }
  });
