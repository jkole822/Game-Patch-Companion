import { authGuard, dbPlugin } from "@api-utils";
import { rolePermissionConflictSchema, unauthorizedConflictSchema } from "@shared/auth";
import {
  sourceDeleteResponseSchema,
  sourceInsertInputSchema,
  sourceNotFoundConflictSchema,
  sourceParamsSchema,
  sourceQuerySchema,
  sourceResponseSchema,
  sourceConflictSchema,
  sourceInUseConflictSchema,
  sourcesResponseSchema,
  sourceUpdateInputSchema,
} from "@shared/sources";
import { Elysia } from "elysia";

import { createSource, deleteSource, findManySources, findOneSource, updateSource } from "./routes";

export const SourcesModule = new Elysia({ prefix: "/sources" })
  .use(dbPlugin)
  .use(authGuard)
  .get(
    "/find-many",
    async ({ query, status, db }) => {
      const response = await findManySources({ db, ...query });

      if (!response.ok) {
        throw new Error("Unhandled find many sources error.");
      }

      return status(200, response.data);
    },
    {
      query: sourceQuerySchema,
      response: {
        200: sourcesResponseSchema,
        401: unauthorizedConflictSchema,
      },
    },
  )
  .get(
    "/find-one/:id",
    async ({ params, status, db }) => {
      const response = await findOneSource({ db, sourceId: params.id });

      if (!response.ok) {
        return status(404, response.error);
      }

      return status(200, response.data);
    },
    {
      params: sourceParamsSchema,
      response: {
        200: sourceResponseSchema,
        401: unauthorizedConflictSchema,
        404: sourceNotFoundConflictSchema,
      },
    },
  )
  .post(
    "/create",
    async ({ body, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await createSource({ db, user, ...body });

      if (!response.ok) {
        if (response.error.error === "NO_PERMISSION_FOR_ROLE") {
          return status(403, response.error);
        }

        return status(400, response.error);
      }

      return status(201, response.data);
    },
    {
      body: sourceInsertInputSchema,
      response: {
        201: sourceResponseSchema,
        400: sourceConflictSchema,
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

      const response = await updateSource({ db, sourceId: params.id, user, ...body });

      if (!response.ok) {
        if (response.error.error === "NO_PERMISSION_FOR_ROLE") {
          return status(403, response.error);
        }

        if (response.error.error === "SOURCE_NOT_FOUND") {
          return status(404, response.error);
        }

        return status(400, response.error);
      }

      return status(200, response.data);
    },
    {
      body: sourceUpdateInputSchema,
      params: sourceParamsSchema,
      response: {
        200: sourceResponseSchema,
        400: sourceConflictSchema,
        401: unauthorizedConflictSchema,
        403: rolePermissionConflictSchema,
        404: sourceNotFoundConflictSchema,
      },
    },
  )
  .delete(
    "/delete/:id",
    async ({ params, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await deleteSource({ db, sourceId: params.id, user });

      if (!response.ok) {
        if (response.error.error === "NO_PERMISSION_FOR_ROLE") {
          return status(403, response.error);
        }

        if (response.error.error === "SOURCE_NOT_FOUND") {
          return status(404, response.error);
        }

        return status(409, response.error);
      }

      return status(200, response.data);
    },
    {
      params: sourceParamsSchema,
      response: {
        200: sourceDeleteResponseSchema,
        401: unauthorizedConflictSchema,
        403: rolePermissionConflictSchema,
        404: sourceNotFoundConflictSchema,
        409: sourceInUseConflictSchema,
      },
    },
  );
