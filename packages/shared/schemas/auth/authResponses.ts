import { z } from "zod";

import { EmailSchema, MessageSchema } from "./authCommon";

export const loginResponseSchema = z.object({
  token: z.string(),
});

export const registerResponseSchema = z.object({
  createdAt: z.iso.datetime(),
  email: EmailSchema,
  id: z.uuid(),
  token: z.string(),
});

export const logoutResponseSchema = MessageSchema;
export const deleteUserResponseSchema = MessageSchema;
