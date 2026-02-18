import { z } from "zod";

export const loginConflictSchema = z.object({
  error: z.literal("INVALID_CREDENTIALS"),
  message: z.string(),
});

export const registerConflictSchema = z.object({
  error: z.literal("EMAIL_ALREADY_EXISTS"),
  message: z.string(),
});

export const rolePermissionConflictSchema = z.object({
  error: z.literal("NO_PERMISSION_FOR_ROLE"),
  message: z.string(),
});

export const unauthorizedConflictSchema = z.object({
  error: z.literal("UNAUTHORIZED"),
  message: z.string(),
});

export const deleteUserConflictSchema = z.object({
  error: z.literal("USER_NOT_FOUND"),
  message: z.string(),
});
