import { authContext, authGuard, dbPlugin } from "@api-utils";
import {
  unauthorizedConflictSchema,
  watchlistMatchQuerySchema,
  watchlistMatchesResponseSchema,
} from "@shared/schemas";
import { Elysia } from "elysia";

import { findManyWatchlistMatches } from "./routes";

export const WatchlistMatchesModule = new Elysia({ prefix: "/watchlist-matches" })
  .use(dbPlugin)
  .use(authContext)
  .use(authGuard)
  .get(
    "/find-many",
    async ({ query, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await findManyWatchlistMatches({ db, user, ...query });

      if (!response.ok) {
        throw new Error("Unhandled find many watchlist matches error.");
      }

      return status(200, response.data);
    },
    {
      query: watchlistMatchQuerySchema,
      response: {
        200: watchlistMatchesResponseSchema,
        401: unauthorizedConflictSchema,
      },
    },
  );
