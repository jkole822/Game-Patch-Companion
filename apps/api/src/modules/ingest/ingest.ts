import { authContext, authGuard, dbPlugin } from "@api-utils";
import {
  contentSyncAlreadyRunningConflictSchema,
  rolePermissionConflictSchema,
  unauthorizedConflictSchema,
  ingestResyncRunResponseSchema,
  ingestRunResponseSchema,
} from "@shared/schemas";
import { Elysia } from "elysia";

import { runIngest, runIngestResync } from "./routes";

export const IngestModule = new Elysia({ prefix: "/ingest" })
  .use(dbPlugin)
  .use(authContext)
  .use(authGuard)
  .post(
    "/run",
    async ({ status, db, user }) => {
      const result = await runIngest({ db, user });

      if (!result.ok) {
        if (result.status === 403) {
          return status(403, result.error);
        }

        return status(409, result.error);
      }

      return status(200, result.data);
    },
    {
      response: {
        200: ingestRunResponseSchema,
        401: unauthorizedConflictSchema,
        403: rolePermissionConflictSchema,
        409: contentSyncAlreadyRunningConflictSchema,
      },
    },
  )
  .post(
    "/resync",
    async ({ status, db, user }) => {
      const result = await runIngestResync({ db, user });

      if (!result.ok) {
        if (result.status === 403) {
          return status(403, result.error);
        }

        return status(409, result.error);
      }

      return status(200, result.data);
    },
    {
      response: {
        200: ingestResyncRunResponseSchema,
        401: unauthorizedConflictSchema,
        403: rolePermissionConflictSchema,
        409: contentSyncAlreadyRunningConflictSchema,
      },
    },
  );
