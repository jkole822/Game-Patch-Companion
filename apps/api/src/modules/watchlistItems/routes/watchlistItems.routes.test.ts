import { describe, expect, it } from "bun:test";

import { createWatchlistItem, updateWatchlistItem } from ".";

import type { AppDb, JwtUser } from "@api-utils";

const user: JwtUser = { id: crypto.randomUUID(), tokenVersion: 0 };
const watchlistId = crypto.randomUUID();
const watchlistItemId = crypto.randomUUID();

describe("watchlist item route handlers", () => {
  describe("createWatchlistItem", () => {
    it("returns WATCHLIST_ITEM_KEYWORD_ALREADY_EXISTS when the scoped keyword is duplicated", async () => {
      const dbMock = {
        insert: () => ({
          values: () => ({
            returning: async () => {
              const error = new Error("duplicate key");
              (error as Error & { code: string }).code = "23505";
              throw error;
            },
          }),
        }),
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: watchlistId }],
            }),
          }),
        }),
      };

      const response = await createWatchlistItem({
        db: dbMock as unknown as AppDb,
        keyword: "mage",
        user,
        watchlistId,
      });

      expect(response).toEqual({
        error: {
          error: "WATCHLIST_ITEM_KEYWORD_ALREADY_EXISTS",
          message: "A watchlist item with this keyword already exists.",
        },
        ok: false,
      });
    });
  });

  describe("updateWatchlistItem", () => {
    it("returns WATCHLIST_ITEM_KEYWORD_ALREADY_EXISTS when the updated keyword collides in the watchlist", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            innerJoin: () => ({
              where: () => ({
                limit: async () => [{ id: watchlistItemId }],
              }),
            }),
          }),
        }),
        update: () => ({
          set: () => ({
            where: () => ({
              returning: async () => {
                const error = new Error("duplicate key");
                (error as Error & { code: string }).code = "23505";
                throw error;
              },
            }),
          }),
        }),
      };

      const response = await updateWatchlistItem({
        db: dbMock as unknown as AppDb,
        keyword: "priest",
        user,
        watchlistItemId,
      });

      expect(response).toEqual({
        error: {
          error: "WATCHLIST_ITEM_KEYWORD_ALREADY_EXISTS",
          message: "A watchlist item with this keyword already exists.",
        },
        ok: false,
      });
    });
  });
});
