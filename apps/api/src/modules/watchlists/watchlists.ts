import { authGuard, dbPlugin } from "@api-utils";
import {
  unauthorizedConflictSchema,
  watchlistDeleteResponseSchema,
  watchlistInsertInputSchema,
  watchlistNotFoundConflictSchema,
  watchlistParamsSchema,
  watchlistQuerySchema,
  watchlistResponseSchema,
  watchlistsResponseSchema,
  watchlistUpdateInputSchema,
} from "@shared/schemas";
import { Elysia } from "elysia";

import {
  createWatchlist,
  deleteWatchlist,
  findManyWatchlists,
  findOneWatchlist,
  updateWatchlist,
} from "./routes";

export const WatchlistsModule = new Elysia({ prefix: "/watchlists" })
  .use(dbPlugin)
  .use(authGuard)
  .get(
    "/find-many",
    async ({ query, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await findManyWatchlists({ db, user, ...query });

      if (!response.ok) {
        throw new Error("Unhandled find many watchlists error.");
      }

      return status(200, response.data);
    },
    {
      query: watchlistQuerySchema,
      response: {
        200: watchlistsResponseSchema,
        401: unauthorizedConflictSchema,
      },
    },
  )
  .get(
    "/find-one/:id",
    async ({ params, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await findOneWatchlist({ db, user, watchlistId: params.id });

      if (!response.ok) {
        return status(404, response.error);
      }

      return status(200, response.data);
    },
    {
      params: watchlistParamsSchema,
      response: {
        200: watchlistResponseSchema,
        401: unauthorizedConflictSchema,
        404: watchlistNotFoundConflictSchema,
      },
    },
  )
  .post(
    "/create",
    async ({ body, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await createWatchlist({ db, user, ...body });

      if (!response.ok) {
        throw new Error("Unhandled create watchlist error.");
      }

      return status(201, response.data);
    },
    {
      body: watchlistInsertInputSchema,
      response: {
        201: watchlistResponseSchema,
        401: unauthorizedConflictSchema,
      },
    },
  )
  .patch(
    "/update/:id",
    async ({ body, params, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await updateWatchlist({ db, user, watchlistId: params.id, ...body });

      if (!response.ok) {
        return status(404, response.error);
      }

      return status(200, response.data);
    },
    {
      body: watchlistUpdateInputSchema,
      params: watchlistParamsSchema,
      response: {
        200: watchlistResponseSchema,
        401: unauthorizedConflictSchema,
        404: watchlistNotFoundConflictSchema,
      },
    },
  )
  .delete(
    "/delete/:id",
    async ({ params, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await deleteWatchlist({ db, user, watchlistId: params.id });

      if (!response.ok) {
        return status(404, response.error);
      }

      return status(200, response.data);
    },
    {
      params: watchlistParamsSchema,
      response: {
        200: watchlistDeleteResponseSchema,
        401: unauthorizedConflictSchema,
        404: watchlistNotFoundConflictSchema,
      },
    },
  );
