import { z } from "zod";

export const EmailSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
  z.email(),
);

export const PasswordSchema = z.string().min(8);

export const MessageSchema = z.object({ message: z.string() });
