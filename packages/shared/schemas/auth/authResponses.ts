import { z } from "zod";

import { EmailSchema, MessageSchema, UserRoleSchema } from "./authCommon";

export const registerResponseSchema = z.object({
  createdAt: z.iso.datetime(),
  email: EmailSchema,
  id: z.uuid(),
  message: z.string(),
});

export const loginResponseSchema = MessageSchema;
export const logoutResponseSchema = MessageSchema;
export const deleteUserResponseSchema = MessageSchema;
export const forgotPasswordResponseSchema = MessageSchema;
export const resetPasswordResponseSchema = MessageSchema;
export const currentUserResponseSchema = z.object({
  email: EmailSchema,
  id: z.uuid(),
  role: UserRoleSchema,
});
