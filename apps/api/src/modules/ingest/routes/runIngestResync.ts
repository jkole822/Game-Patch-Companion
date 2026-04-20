import { runIngestResyncJob } from "@api-jobs";
import {
  contentSyncAlreadyRunningConflictSchema,
  ingestResyncRunResponseSchema,
} from "@shared/schemas";

import { requireAdminUser } from "./requireAdminUser";

import type { IngestResyncJobResult } from "@api-jobs";
import type { AppDb, JwtUser } from "@api-utils";

export const runIngestResync = async ({
  db,
  runJob = runIngestResyncJob,
  user,
}: {
  db: AppDb;
  runJob?: ({ db }: { db: AppDb }) => Promise<IngestResyncJobResult>;
  user: JwtUser | null;
}) => {
  const admin = await requireAdminUser({ db, user });

  if (!admin.ok) {
    return {
      ok: false as const,
      status: 403 as const,
      error: admin.error,
    };
  }

  const result = await runJob({ db });

  if (result.status === "skipped") {
    return {
      ok: false as const,
      status: 409 as const,
      error: contentSyncAlreadyRunningConflictSchema.parse({
        activeJob: result.activeJob,
        error: "CONTENT_SYNC_ALREADY_RUNNING",
        message: result.message,
      }),
    };
  }

  return {
    ok: true as const,
    data: ingestResyncRunResponseSchema.parse(result),
  };
};
