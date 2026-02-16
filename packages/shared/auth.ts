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
