import { authGuard, dbPlugin } from "@api-utils";
import {
  gameNotFoundConflictSchema,
  unauthorizedConflictSchema,
  watchlistItemConflictSchema,
  watchlistItemDeleteResponseSchema,
  watchlistItemInsertInputSchema,
  watchlistItemNotFoundConflictSchema,
  watchlistItemParamsSchema,
  watchlistItemQuerySchema,
  watchlistItemResponseSchema,
  watchlistItemsResponseSchema,
  watchlistItemUpdateInputSchema,
  watchlistNotFoundConflictSchema,
} from "@shared/schemas";
import { Elysia } from "elysia";
import { z } from "zod";

import {
  createWatchlistItem,
  deleteWatchlistItem,
  findManyWatchlistItems,
  findOneWatchlistItem,
  updateWatchlistItem,
} from "./routes";

export const WatchlistItemsModule = new Elysia({ prefix: "/watchlist-items" })
  .use(dbPlugin)
  .use(authGuard)
  .get(
    "/find-many",
    async ({ query, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await findManyWatchlistItems({ db, user, ...query });

      if (!response.ok) {
        throw new Error("Unhandled find many watchlist items error.");
      }

      return status(200, response.data);
    },
    {
      query: watchlistItemQuerySchema,
      response: {
        200: watchlistItemsResponseSchema,
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

      const response = await findOneWatchlistItem({ db, user, watchlistItemId: params.id });

      if (!response.ok) {
        return status(404, response.error);
      }

      return status(200, response.data);
    },
    {
      params: watchlistItemParamsSchema,
      response: {
        200: watchlistItemResponseSchema,
        401: unauthorizedConflictSchema,
        404: watchlistItemNotFoundConflictSchema,
      },
    },
  )
  .post(
    "/create",
    async ({ body, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await createWatchlistItem({ db, user, ...body });

      if (!response.ok) {
        if (
          response.error.error === "WATCHLIST_NOT_FOUND" ||
          response.error.error === "GAME_NOT_FOUND"
        ) {
          return status(404, response.error);
        }

        return status(400, response.error);
      }

      return status(201, response.data);
    },
    {
      body: watchlistItemInsertInputSchema,
      response: {
        201: watchlistItemResponseSchema,
        400: watchlistItemConflictSchema,
        401: unauthorizedConflictSchema,
        404: z.union([gameNotFoundConflictSchema, watchlistNotFoundConflictSchema]),
      },
    },
  )
  .patch(
    "/update/:id",
    async ({ body, params, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await updateWatchlistItem({ db, user, watchlistItemId: params.id, ...body });

      if (!response.ok) {
        if (
          response.error.error === "WATCHLIST_ITEM_NOT_FOUND" ||
          response.error.error === "WATCHLIST_NOT_FOUND" ||
          response.error.error === "GAME_NOT_FOUND"
        ) {
          return status(404, response.error);
        }

        return status(400, response.error);
      }

      return status(200, response.data);
    },
    {
      body: watchlistItemUpdateInputSchema,
      params: watchlistItemParamsSchema,
      response: {
        200: watchlistItemResponseSchema,
        400: watchlistItemConflictSchema,
        401: unauthorizedConflictSchema,
        404: z.union([
          watchlistItemNotFoundConflictSchema,
          watchlistNotFoundConflictSchema,
          gameNotFoundConflictSchema,
        ]),
      },
    },
  )
  .delete(
    "/delete/:id",
    async ({ params, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await deleteWatchlistItem({ db, user, watchlistItemId: params.id });

      if (!response.ok) {
        return status(404, response.error);
      }

      return status(200, response.data);
    },
    {
      params: watchlistItemParamsSchema,
      response: {
        200: watchlistItemDeleteResponseSchema,
        401: unauthorizedConflictSchema,
        404: watchlistItemNotFoundConflictSchema,
      },
    },
  );
