import { runIngestJob } from "@api-jobs/ingest";
import { authGuard, dbPlugin } from "@api-utils";
import { users } from "@db/schema";
import { rolePermissionConflictSchema, unauthorizedConflictSchema } from "@shared/schemas";
import { ingestAlreadyRunningConflictSchema, ingestRunResponseSchema } from "@shared/schemas";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";

export const IngestModule = new Elysia({ prefix: "/ingest" })
  .use(dbPlugin)
  .use(authGuard)
  .post(
    "/run",
    async ({ status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const [authUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

      if (!authUser) {
        throw new Error("User not found");
      }

      if (authUser.role !== "admin") {
        return status(
          403,
          rolePermissionConflictSchema.parse({
            error: "NO_PERMISSION_FOR_ROLE",
            message: "You do not have permission to run ingest jobs.",
          }),
        );
      }

      const result = await runIngestJob({ db });

      if (result.status === "skipped") {
        return status(
          409,
          ingestAlreadyRunningConflictSchema.parse({
            error: "INGEST_ALREADY_RUNNING",
            message: result.message,
          }),
        );
      }

      return status(200, ingestRunResponseSchema.parse(result));
    },
    {
      response: {
        200: ingestRunResponseSchema,
        401: unauthorizedConflictSchema,
        403: rolePermissionConflictSchema,
        409: ingestAlreadyRunningConflictSchema,
      },
    },
  );
