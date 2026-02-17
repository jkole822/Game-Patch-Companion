import { dbPlugin, jwtPlugin, mapRouteResult } from "@api-utils";
import {
  loginConflictSchema,
  loginResponseSchema,
  loginSchema,
  registerConflictSchema,
  registerResponseSchema,
  registerSchema,
} from "@shared/auth";
import { Elysia } from "elysia";

import { login, register } from "./routes";

export const AuthModule = new Elysia({ prefix: "/auth" })
  .use(dbPlugin)
  .use(jwtPlugin)
  .post(
    "/register",
    async ({ body, status, db, jwt }) => {
      const response = await register({ db, ...body, signToken: (id) => jwt.sign({ id }) });

      return mapRouteResult(response, {
        onError: (error) => status(400, error),
        onSuccess: (data) => status(201, data),
      });
    },
    {
      body: registerSchema,
      response: {
        201: registerResponseSchema,
        400: registerConflictSchema,
      },
    },
  )
  .post(
    "/login",
    async ({ body, status, db, jwt }) => {
      const response = await login({ db, ...body, signToken: (id) => jwt.sign({ id }) });

      return mapRouteResult(response, {
        onError: (error) => status(400, error),
        onSuccess: (data) => data,
      });
    },
    {
      body: loginSchema,
      response: {
        200: loginResponseSchema,
        400: loginConflictSchema,
      },
    },
  );
