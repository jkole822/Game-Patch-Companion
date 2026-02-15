import { dbPlugin } from "@api-utils/db";
import { registerConflictSchema, registerResponseSchema, registerSchema } from "@shared/auth";
import { Elysia } from "elysia";

import { register } from "./register";

export const AuthModule = new Elysia({ prefix: "/auth" }).use(dbPlugin).post(
  "/register",
  async ({ body, status, db }) => {
    const response = await register({ db, ...body });

    if (!response.ok) {
      throw status(400, response.error);
    }

    return response.data;
  },
  {
    body: registerSchema,
    response: {
      200: registerResponseSchema,
      400: registerConflictSchema,
    },
  },
);
