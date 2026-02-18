import { authGuard, dbPlugin } from "@api-utils";
import { rolePermissionConflictSchema, unauthorizedConflictSchema } from "@shared/schemas";
import {
  patchEntriesResponseSchema,
  patchEntryConflictSchema,
  patchEntryDeleteResponseSchema,
  patchEntryNotFoundConflictSchema,
  patchEntryParamsSchema,
  patchEntryQuerySchema,
  patchEntryResponseSchema,
  patchEntryUpdateInputSchema,
} from "@shared/schemas";
import { Elysia } from "elysia";

import {
  deletePatchEntry,
  findManyPatchEntries,
  findOnePatchEntry,
  updatePatchEntry,
} from "./routes";

export const PatchEntriesModule = new Elysia({ prefix: "/patch-entries" })
  .use(dbPlugin)
  .use(authGuard)
  .get(
    "/find-many",
    async ({ query, status, db }) => {
      const response = await findManyPatchEntries({ db, ...query });

      if (!response.ok) {
        throw new Error("Unhandled find many patch entries error.");
      }

      return status(200, response.data);
    },
    {
      query: patchEntryQuerySchema,
      response: {
        200: patchEntriesResponseSchema,
        401: unauthorizedConflictSchema,
      },
    },
  )
  .get(
    "/find-one/:id",
    async ({ params, status, db }) => {
      const response = await findOnePatchEntry({ db, patchEntryId: params.id });

      if (!response.ok) {
        return status(404, response.error);
      }

      return status(200, response.data);
    },
    {
      params: patchEntryParamsSchema,
      response: {
        200: patchEntryResponseSchema,
        401: unauthorizedConflictSchema,
        404: patchEntryNotFoundConflictSchema,
      },
    },
  )
  .patch(
    "/update/:id",
    async ({ body, params, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await updatePatchEntry({ db, patchEntryId: params.id, user, ...body });

      if (!response.ok) {
        if (response.error.error === "NO_PERMISSION_FOR_ROLE") {
          return status(403, response.error);
        }

        if (response.error.error === "PATCH_ENTRY_NOT_FOUND") {
          return status(404, response.error);
        }

        return status(400, response.error);
      }

      return status(200, response.data);
    },
    {
      body: patchEntryUpdateInputSchema,
      params: patchEntryParamsSchema,
      response: {
        200: patchEntryResponseSchema,
        400: patchEntryConflictSchema,
        401: unauthorizedConflictSchema,
        403: rolePermissionConflictSchema,
        404: patchEntryNotFoundConflictSchema,
      },
    },
  )
  .delete(
    "/delete/:id",
    async ({ params, status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await deletePatchEntry({ db, patchEntryId: params.id, user });

      if (!response.ok) {
        if (response.error.error === "NO_PERMISSION_FOR_ROLE") {
          return status(403, response.error);
        }

        return status(404, response.error);
      }

      return status(200, response.data);
    },
    {
      params: patchEntryParamsSchema,
      response: {
        200: patchEntryDeleteResponseSchema,
        401: unauthorizedConflictSchema,
        403: rolePermissionConflictSchema,
        404: patchEntryNotFoundConflictSchema,
      },
    },
  );
