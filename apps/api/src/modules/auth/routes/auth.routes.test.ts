import { describe, expect, it } from "bun:test";

import { deleteUser, login, logout, register } from ".";

import type { AppDb } from "@api-utils";

describe("auth route handlers", () => {
  describe("register", () => {
    it("returns created user data with token", async () => {
      const createdAt = new Date();
      const email = `register-${crypto.randomUUID()}@example.com`;
      const id = crypto.randomUUID();
      const tokenVersion = 0;
      const dbMock = {
        insert: () => ({
          values: () => ({
            returning: async () => [{ createdAt, email, id, tokenVersion }],
          }),
        }),
      };

      const response = await register({
        db: dbMock as unknown as AppDb,
        email,
        password: "password123",
        signToken: async (userId, version) => `token-${userId}-${version}`,
      });

      expect(response.ok).toBe(true);
      if (!response.ok) {
        throw new Error("Expected success response");
      }

      expect(response.data).toEqual({
        createdAt: createdAt.toISOString(),
        email,
        id,
        token: `token-${id}-${tokenVersion}`,
      });
    });

    it("returns EMAIL_ALREADY_EXISTS on unique conflict", async () => {
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
      };

      const response = await register({
        db: dbMock as unknown as AppDb,
        email: `register-dup-${crypto.randomUUID()}@example.com`,
        password: "password123",
        signToken: async () => "unused-token",
      });

      expect(response).toEqual({
        error: {
          error: "EMAIL_ALREADY_EXISTS",
          message: "An account with this email already exists.",
        },
        ok: false,
      });
    });
  });

  describe("login", () => {
    it("returns INVALID_CREDENTIALS when user is not found", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [],
            }),
          }),
        }),
      };

      const response = await login({
        db: dbMock as unknown as AppDb,
        email: "missing@example.com",
        password: "password123",
        signToken: async () => "unused",
      });

      expect(response).toEqual({
        error: {
          error: "INVALID_CREDENTIALS",
          message: "Invalid credentials.",
        },
        ok: false,
      });
    });

    it("returns INVALID_CREDENTIALS when password is incorrect", async () => {
      const passwordHash = await Bun.password.hash("correct-password");
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [
                {
                  id: crypto.randomUUID(),
                  passwordHash,
                  tokenVersion: 0,
                },
              ],
            }),
          }),
        }),
      };

      const response = await login({
        db: dbMock as unknown as AppDb,
        email: "user@example.com",
        password: "wrong-password",
        signToken: async () => "unused",
      });

      expect(response).toEqual({
        error: {
          error: "INVALID_CREDENTIALS",
          message: "Invalid credentials.",
        },
        ok: false,
      });
    });

    it("returns token when credentials are valid", async () => {
      const id = crypto.randomUUID();
      const tokenVersion = 3;
      const password = "correct-password";
      const passwordHash = await Bun.password.hash(password);
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [
                {
                  id,
                  passwordHash,
                  tokenVersion,
                },
              ],
            }),
          }),
        }),
      };

      const response = await login({
        db: dbMock as unknown as AppDb,
        email: "user@example.com",
        password,
        signToken: async (userId, version) => `token-${userId}-${version}`,
      });

      expect(response).toEqual({
        data: {
          token: `token-${id}-${tokenVersion}`,
        },
        ok: true,
      });
    });
  });

  describe("logout", () => {
    it("returns success response", async () => {
      const dbMock = {
        update: () => ({
          set: () => ({
            where: async () => undefined,
          }),
        }),
      };

      const response = await logout({
        db: dbMock as unknown as AppDb,
        userId: crypto.randomUUID(),
      });

      expect(response).toEqual({
        data: {
          message: "Logged out successfully.",
        },
        ok: true,
      });
    });
  });

  describe("deleteUser", () => {
    it("returns USER_NOT_FOUND when no user is deleted", async () => {
      const dbMock = {
        delete: () => ({
          where: () => ({
            returning: async () => [],
          }),
        }),
      };

      const response = await deleteUser({
        db: dbMock as unknown as AppDb,
        userId: crypto.randomUUID(),
      });

      expect(response).toEqual({
        error: {
          error: "USER_NOT_FOUND",
          message: "User not found.",
        },
        ok: false,
      });
    });

    it("returns success response when user is deleted", async () => {
      const dbMock = {
        delete: () => ({
          where: () => ({
            returning: async () => [{ id: crypto.randomUUID() }],
          }),
        }),
      };

      const response = await deleteUser({
        db: dbMock as unknown as AppDb,
        userId: crypto.randomUUID(),
      });

      expect(response).toEqual({
        data: {
          message: "User deleted successfully.",
        },
        ok: true,
      });
    });
  });
});
