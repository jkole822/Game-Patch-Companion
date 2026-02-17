import { Elysia } from "elysia";

import { jwtPlugin } from "./jwt";

export type JwtUser = {
  id: string;
};

const BEARER_PREFIX = "Bearer ";

export const authGuard = new Elysia({ name: "auth-guard" })
  .use(jwtPlugin)
  .decorate("user", null as JwtUser | null)
  .derive({ as: "scoped" }, async ({ headers, jwt }) => {
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
      typeof payload.id !== "string"
    ) {
      return { user: null as JwtUser | null };
    }

    return {
      user: {
        id: payload.id,
      } as JwtUser,
    };
  })
  .onBeforeHandle({ as: "scoped" }, ({ status, user }) => {
    if (!user) {
      return status(401, {
        error: "UNAUTHORIZED",
        message: "Missing or invalid token.",
      });
    }
  });
