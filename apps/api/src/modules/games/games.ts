import { authGuard, dbPlugin } from "@api-utils";
import { rolePermissionConflictSchema, unauthorizedConflictSchema } from "@shared/schemas";
import {
  gameConflictSchema,
  gameDeleteResponseSchema,
  gameInUseConflictSchema,
  gameInsertInputSchema,
  gameNotFoundConflictSchema,
  gameParamsSchema,
  gameQuerySchema,
  gameResponseSchema,
  gamesResponseSchema,
  gameUpdateInputSchema,
} from "@shared/schemas";
import { Elysia } from "elysia";

import { createGame, deleteGame, findManyGames, findOneGame, updateGame } from "./routes";

export const GamesModule = new Elysia({ prefix: "/games" })
  .use(dbPlugin)
  .use(authGuard)
  .get(
    "/find-many",
    async ({ query, status, db }) => {
      const response = await findManyGames({ db, ...query });

      if (!response.ok) {
        throw new Error("Unhandled find many games error.");
      }

      return status(200, response.data);
    },
    {
      query: gameQuerySchema,
      response: {
        200: gamesResponseSchema,
        401: unauthorizedConflictSchema,
      },
    },
  )
  .get(
    "/find-one/:id",
    async ({ params, status, db }) => {
      const response = await findOneGame({ db, gameId: params.id });

      if (!response.ok) {
        return status(404, response.error);
      }

      return status(200, response.data);
    },
    {
      params: gameParamsSchema,
      response: {
        200: gameResponseSchema,
        401: unauthorizedConflictSchema,
        404: gameNotFoundConflictSchema,
      },
    },
  )
  .post(
    "/create",
    async ({ body, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await createGame({ db, user, ...body });

      if (!response.ok) {
        if (response.error.error === "NO_PERMISSION_FOR_ROLE") {
          return status(403, response.error);
        }

        return status(400, response.error);
      }

      return status(201, response.data);
    },
    {
      body: gameInsertInputSchema,
      response: {
        201: gameResponseSchema,
        400: gameConflictSchema,
        401: unauthorizedConflictSchema,
        403: rolePermissionConflictSchema,
      },
    },
  )
  .patch(
    "/update/:id",
    async ({ body, params, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await updateGame({ db, gameId: params.id, user, ...body });

      if (!response.ok) {
        if (response.error.error === "NO_PERMISSION_FOR_ROLE") {
          return status(403, response.error);
        }

        if (response.error.error === "GAME_NOT_FOUND") {
          return status(404, response.error);
        }

        return status(400, response.error);
      }

      return status(200, response.data);
    },
    {
      body: gameUpdateInputSchema,
      params: gameParamsSchema,
      response: {
        200: gameResponseSchema,
        400: gameConflictSchema,
        401: unauthorizedConflictSchema,
        403: rolePermissionConflictSchema,
        404: gameNotFoundConflictSchema,
      },
    },
  )
  .delete(
    "/delete/:id",
    async ({ params, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await deleteGame({ db, gameId: params.id, user });

      if (!response.ok) {
        if (response.error.error === "NO_PERMISSION_FOR_ROLE") {
          return status(403, response.error);
        }

        if (response.error.error === "GAME_NOT_FOUND") {
          return status(404, response.error);
        }

        return status(409, response.error);
      }

      return status(200, response.data);
    },
    {
      params: gameParamsSchema,
      response: {
        200: gameDeleteResponseSchema,
        401: unauthorizedConflictSchema,
        403: rolePermissionConflictSchema,
        404: gameNotFoundConflictSchema,
        409: gameInUseConflictSchema,
      },
    },
  );
