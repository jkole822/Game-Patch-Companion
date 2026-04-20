import { describe, expect, it } from "bun:test";

import { runIngestResync } from ".";

import type { IngestResyncJobResult } from "@api-jobs";
import type { AppDb, JwtUser } from "@api-utils";

const user: JwtUser = { id: crypto.randomUUID(), tokenVersion: 0 };
type CompletedIngestResyncJobResult = Extract<IngestResyncJobResult, { status: "completed" }>;

const createDbMock = ({ role }: { role: "admin" | "user" }) =>
  ({
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => [{ id: user.id, role }],
        }),
      }),
    }),
  }) as unknown as AppDb;

const completedResyncResult = (): CompletedIngestResyncJobResult => {
  const startedAt = new Date("2026-04-20T12:00:00.000Z");
  const finishedAt = new Date("2026-04-20T12:00:01.000Z");

  return {
    status: "completed",
    assignGames: {
      status: "completed",
      assignedEntries: 0,
      durationMs: 0,
      finishedAt: finishedAt.toISOString(),
      processedEntries: 0,
      skippedEntries: 0,
      startedAt: startedAt.toISOString(),
    },
    checkedEntries: 3,
    durationMs: 1000,
    failedEntries: 0,
    finishedAt: finishedAt.toISOString(),
    processedSources: 1,
    startedAt: startedAt.toISOString(),
    updatedEntries: 2,
  };
};

describe("ingest route handlers", () => {
  describe("runIngestResync", () => {
    it("returns resync result for admin users", async () => {
      const result = completedResyncResult();
      const response = await runIngestResync({
        db: createDbMock({ role: "admin" }),
        runJob: async () => result,
        user,
      });

      expect(response).toEqual({
        ok: true,
        data: result,
      });
    });

    it("returns NO_PERMISSION_FOR_ROLE for non-admin users", async () => {
      const response = await runIngestResync({
        db: createDbMock({ role: "user" }),
        runJob: async () => completedResyncResult(),
        user,
      });

      expect(response).toEqual({
        ok: false,
        status: 403,
        error: {
          error: "NO_PERMISSION_FOR_ROLE",
          message: "You do not have permission to run ingest jobs.",
        },
      });
    });

    it("returns CONTENT_SYNC_ALREADY_RUNNING when another content sync job holds the lock", async () => {
      const response = await runIngestResync({
        db: createDbMock({ role: "admin" }),
        runJob: async () => ({
          status: "skipped",
          reason: "ALREADY_RUNNING",
          activeJob: "ingest",
          message: "ingest job is already running.",
        }),
        user,
      });

      expect(response).toEqual({
        ok: false,
        status: 409,
        error: {
          activeJob: "ingest",
          error: "CONTENT_SYNC_ALREADY_RUNNING",
          message: "ingest job is already running.",
        },
      });
    });
  });
});
