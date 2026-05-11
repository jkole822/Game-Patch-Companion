import { describe, expect, it } from "bun:test";

import { findManyWatchlistMatches } from ".";

import type { AppDb, JwtUser } from "@api-utils";

const user: JwtUser = { id: crypto.randomUUID(), tokenVersion: 0 };
const matchRecord = {
  createdAt: new Date(),
  id: crypto.randomUUID(),
  keyword: "mage",
  matchText: "Mage damage increased by 1.",
  patchEntryCreatedAt: new Date(),
  patchEntryId: crypto.randomUUID(),
  patchEntryPublishedAt: new Date(),
  patchEntryTitle: "Patch 1.0.1",
  patchEntryUrl: "https://example.com/patch",
  state: "added" as const,
  watchlistId: crypto.randomUUID(),
  watchlistItemId: crypto.randomUUID(),
  watchlistName: "Class tuning",
};

describe("watchlist match route handlers", () => {
  describe("findManyWatchlistMatches", () => {
    it("returns the user's watchlist matches", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            innerJoin: () => ({
              innerJoin: () => ({
                innerJoin: () => ({
                  where: () => ({
                    orderBy: async () => [matchRecord],
                  }),
                }),
              }),
            }),
          }),
        }),
      };

      const response = await findManyWatchlistMatches({
        db: dbMock as unknown as AppDb,
        user,
        watchlistId: matchRecord.watchlistId,
      });

      expect(response).toEqual({
        data: [matchRecord],
        ok: true,
      });
    });
  });
});
