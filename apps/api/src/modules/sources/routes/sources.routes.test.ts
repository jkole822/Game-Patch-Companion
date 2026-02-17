import { describe, expect, it } from "bun:test";

import { createSource, deleteSource, findManySources, findOneSource, updateSource } from ".";

import type { AppDb, JwtUser } from "@api-utils";

const adminUser: JwtUser = { id: crypto.randomUUID(), tokenVersion: 0 };
const baseSource = {
  baseUrl: "https://example.com",
  config: {},
  createdAt: new Date(),
  id: crypto.randomUUID(),
  isEnabled: true,
  key: "test-key",
  name: "Test Source",
  type: "rss" as const,
};

describe("source route handlers", () => {
  describe("findOneSource", () => {
    it("returns SOURCE_NOT_FOUND when source is missing", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [],
            }),
          }),
        }),
      };

      const response = await findOneSource({
        db: dbMock as unknown as AppDb,
        sourceId: crypto.randomUUID(),
      });

      expect(response).toEqual({
        error: {
          error: "SOURCE_NOT_FOUND",
          message: "Source not found.",
        },
        ok: false,
      });
    });

    it("returns source when it exists", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [baseSource],
            }),
          }),
        }),
      };

      const response = await findOneSource({
        db: dbMock as unknown as AppDb,
        sourceId: baseSource.id,
      });

      expect(response).toEqual({
        data: baseSource,
        ok: true,
      });
    });
  });

  describe("findManySources", () => {
    it("returns source list", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            where: async () => [baseSource],
          }),
        }),
      };

      const response = await findManySources({
        db: dbMock as unknown as AppDb,
        key: baseSource.key,
      });

      expect(response).toEqual({
        data: [baseSource],
        ok: true,
      });
    });
  });

  describe("createSource", () => {
    it("returns NO_PERMISSION_FOR_ROLE for non-admin users", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: adminUser.id, role: "user" }],
            }),
          }),
        }),
      };

      const response = await createSource({
        baseUrl: baseSource.baseUrl,
        config: baseSource.config,
        db: dbMock as unknown as AppDb,
        isEnabled: baseSource.isEnabled,
        key: baseSource.key,
        name: baseSource.name,
        type: baseSource.type,
        user: adminUser,
      });

      expect(response).toEqual({
        error: {
          error: "NO_PERMISSION_FOR_ROLE",
          message: "You do not have permission to create sources.",
        },
        ok: false,
      });
    });

    it("returns created source for admin user", async () => {
      const dbMock = {
        insert: () => ({
          values: () => ({
            returning: async () => [baseSource],
          }),
        }),
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: adminUser.id, role: "admin" }],
            }),
          }),
        }),
      };

      const response = await createSource({
        baseUrl: baseSource.baseUrl,
        config: baseSource.config,
        db: dbMock as unknown as AppDb,
        isEnabled: baseSource.isEnabled,
        key: baseSource.key,
        name: baseSource.name,
        type: baseSource.type,
        user: adminUser,
      });

      expect(response).toEqual({
        data: baseSource,
        ok: true,
      });
    });

    it("returns SOURCE_KEY_ALREADY_EXISTS on duplicate key", async () => {
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
              limit: async () => [{ id: adminUser.id, role: "admin" }],
            }),
          }),
        }),
      };

      const response = await createSource({
        baseUrl: baseSource.baseUrl,
        config: baseSource.config,
        db: dbMock as unknown as AppDb,
        isEnabled: baseSource.isEnabled,
        key: baseSource.key,
        name: baseSource.name,
        type: baseSource.type,
        user: adminUser,
      });

      expect(response).toEqual({
        error: {
          error: "SOURCE_KEY_ALREADY_EXISTS",
          message: "A source with this key already exists.",
        },
        ok: false,
      });
    });
  });

  describe("updateSource", () => {
    it("returns NO_PERMISSION_FOR_ROLE for non-admin users", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: adminUser.id, role: "user" }],
            }),
          }),
        }),
      };

      const response = await updateSource({
        db: dbMock as unknown as AppDb,
        name: "Updated Source",
        sourceId: baseSource.id,
        user: adminUser,
      });

      expect(response).toEqual({
        error: {
          error: "NO_PERMISSION_FOR_ROLE",
          message: "You do not have permission to update sources.",
        },
        ok: false,
      });
    });

    it("returns SOURCE_NOT_FOUND when source does not exist", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: adminUser.id, role: "admin" }],
            }),
          }),
        }),
        update: () => ({
          set: () => ({
            where: () => ({
              returning: async () => [],
            }),
          }),
        }),
      };

      const response = await updateSource({
        db: dbMock as unknown as AppDb,
        name: "Updated Source",
        sourceId: baseSource.id,
        user: adminUser,
      });

      expect(response).toEqual({
        error: {
          error: "SOURCE_NOT_FOUND",
          message: "Source not found.",
        },
        ok: false,
      });
    });

    it("returns updated source for admin user", async () => {
      const updatedSource = { ...baseSource, name: "Updated Source" };
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: adminUser.id, role: "admin" }],
            }),
          }),
        }),
        update: () => ({
          set: () => ({
            where: () => ({
              returning: async () => [updatedSource],
            }),
          }),
        }),
      };

      const response = await updateSource({
        db: dbMock as unknown as AppDb,
        name: "Updated Source",
        sourceId: baseSource.id,
        user: adminUser,
      });

      expect(response).toEqual({
        data: updatedSource,
        ok: true,
      });
    });

    it("returns SOURCE_KEY_ALREADY_EXISTS on duplicate key", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: adminUser.id, role: "admin" }],
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

      const response = await updateSource({
        db: dbMock as unknown as AppDb,
        name: "Updated Source",
        sourceId: baseSource.id,
        user: adminUser,
      });

      expect(response).toEqual({
        error: {
          error: "SOURCE_KEY_ALREADY_EXISTS",
          message: "A source with this key already exists.",
        },
        ok: false,
      });
    });
  });

  describe("deleteSource", () => {
    it("returns NO_PERMISSION_FOR_ROLE for non-admin users", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: adminUser.id, role: "user" }],
            }),
          }),
        }),
      };

      const response = await deleteSource({
        db: dbMock as unknown as AppDb,
        sourceId: baseSource.id,
        user: adminUser,
      });

      expect(response).toEqual({
        error: {
          error: "NO_PERMISSION_FOR_ROLE",
          message: "You do not have permission to delete sources.",
        },
        ok: false,
      });
    });

    it("returns SOURCE_NOT_FOUND when source does not exist", async () => {
      const dbMock = {
        delete: () => ({
          where: () => ({
            returning: async () => [],
          }),
        }),
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: adminUser.id, role: "admin" }],
            }),
          }),
        }),
      };

      const response = await deleteSource({
        db: dbMock as unknown as AppDb,
        sourceId: baseSource.id,
        user: adminUser,
      });

      expect(response).toEqual({
        error: {
          error: "SOURCE_NOT_FOUND",
          message: "Source not found.",
        },
        ok: false,
      });
    });

    it("returns success response when source is deleted", async () => {
      const dbMock = {
        delete: () => ({
          where: () => ({
            returning: async () => [{ id: baseSource.id }],
          }),
        }),
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: adminUser.id, role: "admin" }],
            }),
          }),
        }),
      };

      const response = await deleteSource({
        db: dbMock as unknown as AppDb,
        sourceId: baseSource.id,
        user: adminUser,
      });

      expect(response).toEqual({
        data: {
          message: "Source deleted successfully.",
        },
        ok: true,
      });
    });

    it("returns SOURCE_IN_USE on foreign key conflict", async () => {
      const dbMock = {
        delete: () => ({
          where: () => ({
            returning: async () => {
              const error = new Error("foreign key conflict");
              (error as Error & { code: string }).code = "23503";
              throw error;
            },
          }),
        }),
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: adminUser.id, role: "admin" }],
            }),
          }),
        }),
      };

      const response = await deleteSource({
        db: dbMock as unknown as AppDb,
        sourceId: baseSource.id,
        user: adminUser,
      });

      expect(response).toEqual({
        error: {
          error: "SOURCE_IN_USE",
          message: "Source cannot be deleted because it is referenced by patch entries.",
        },
        ok: false,
      });
    });
  });
});
