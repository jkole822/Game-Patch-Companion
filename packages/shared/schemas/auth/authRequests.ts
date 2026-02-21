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
