import { z } from "zod";

const EmailSchema = z.preprocess((val) => {
  if (typeof val === "string") {
    return val.trim().toLowerCase();
  }
  return val;
}, z.email());

export const loginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8),
});

export const loginResponseSchema = z.object({
  token: z.string(),
});

export const loginConflictSchema = z.object({
  error: z.literal("INVALID_CREDENTIALS"),
  message: z.string(),
});

export const registerSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8),
});

export const registerResponseSchema = z.object({
  id: z.uuid(),
  email: EmailSchema,
  token: z.string(),
  createdAt: z.iso.datetime(),
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

export const logoutResponseSchema = z.object({
  message: z.string(),
});

export const deleteUserResponseSchema = z.object({
  message: z.string(),
});

export const deleteUserConflictSchema = z.object({
  error: z.literal("USER_NOT_FOUND"),
  message: z.string(),
});
