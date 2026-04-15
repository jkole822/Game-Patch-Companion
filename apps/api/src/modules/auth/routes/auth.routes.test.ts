import { describe, expect, it } from "bun:test";

import { deleteUser, forgotPassword, login, logout, register, resetPassword } from ".";

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

  describe("forgotPassword", () => {
    it("returns a success message even when the user does not exist", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [],
            }),
          }),
        }),
      };

      const response = await forgotPassword({
        db: dbMock as unknown as AppDb,
        email: "missing@example.com",
      });

      expect(response).toEqual({
        data: {
          message: "If an account exists for that email, a reset link will be sent.",
        },
        ok: true,
      });
    });

    it("creates a reset token when the user exists", async () => {
      const insertValues: Array<Record<string, unknown>> = [];
      const sentEmails: Array<{ email: string; token: string }> = [];
      const userId = crypto.randomUUID();
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: userId }],
            }),
          }),
        }),
        insert: () => ({
          values: async (value: Record<string, unknown>) => {
            insertValues.push(value);
            return undefined;
          },
        }),
      };

      const response = await forgotPassword({
        createToken: () => "known-reset-token",
        db: dbMock as unknown as AppDb,
        email: "user@example.com",
        sendResetEmail: async (payload) => {
          sentEmails.push(payload);
        },
      });

      expect(response.ok).toBe(true);
      expect(insertValues).toHaveLength(1);
      expect(sentEmails).toEqual([
        {
          email: "user@example.com",
          token: "known-reset-token",
        },
      ]);
      expect(insertValues[0]).toMatchObject({
        tokenHash: expect.any(String),
        userId,
      });
    });
  });

  describe("resetPassword", () => {
    it("returns INVALID_RESET_TOKEN when the token is missing or expired", async () => {
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [],
            }),
          }),
        }),
      };

      const response = await resetPassword({
        db: dbMock as unknown as AppDb,
        password: "password123",
        token: "missing-token",
      });

      expect(response).toEqual({
        error: {
          error: "INVALID_RESET_TOKEN",
          message: "This reset link is invalid or has expired.",
        },
        ok: false,
      });
    });

    it("updates the password, invalidates sessions, and marks the token used", async () => {
      const updates: Array<Record<string, unknown>> = [];
      const tokenId = crypto.randomUUID();
      const userId = crypto.randomUUID();
      const dbMock = {
        select: () => ({
          from: () => ({
            where: () => ({
              limit: async () => [{ id: tokenId, userId }],
            }),
          }),
        }),
        update: () => ({
          set: (value: Record<string, unknown>) => {
            updates.push(value);
            return {
              where: async () => undefined,
            };
          },
        }),
      };

      const response = await resetPassword({
        db: dbMock as unknown as AppDb,
        password: "new-password123",
        token: "valid-token",
      });

      expect(response).toEqual({
        data: {
          message: "Password reset successfully.",
        },
        ok: true,
      });
      expect(updates).toHaveLength(2);
      expect(typeof updates[0]?.passwordHash).toBe("string");
      expect(updates[1]).toMatchObject({
        usedAt: expect.any(Date),
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
