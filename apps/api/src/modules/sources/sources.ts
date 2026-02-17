import { authGuard, dbPlugin } from "@api-utils";
import { rolePermissionConflictSchema, unauthorizedConflictSchema } from "@shared/auth";
import {
  sourceInsertInputSchema,
  sourceResponseSchema,
  sourceConflictSchema,
} from "@shared/sources";
import { Elysia } from "elysia";

import { createSource } from "./routes";

export const SourcesModule = new Elysia({ prefix: "/sources" })
  .use(dbPlugin)
  .use(authGuard)
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
  );
