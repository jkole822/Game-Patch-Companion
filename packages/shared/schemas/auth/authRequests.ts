import { z } from "zod";

import { EmailSchema, PasswordSchema } from "./authCommon";

export const loginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const registerSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const forgotPasswordSchema = z.object({
  email: EmailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: PasswordSchema,
    token: z.string().min(1),
  })
  .strict();
