import { authGuard, dbPlugin, jwtPlugin, mapRouteResult } from "@api-utils";
import {
  deleteUserConflictSchema,
  deleteUserResponseSchema,
  loginConflictSchema,
  loginResponseSchema,
  loginSchema,
  logoutResponseSchema,
  registerConflictSchema,
  registerResponseSchema,
  registerSchema,
  unauthorizedConflictSchema,
} from "@shared/auth";
import { Elysia } from "elysia";

import { deleteUser, login, logout, register } from "./routes";

const AuthProtectedRoutes = new Elysia()
  .use(dbPlugin)
  .use(authGuard)
  .post(
    "/logout",
    async ({ db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await logout({ db, userId: user.id });
      return response.data;
    },
    {
      response: {
        200: logoutResponseSchema,
        401: unauthorizedConflictSchema,
      },
    },
  )
  .delete(
    "/user",
    async ({ status, db, user }) => {
      if (!user) {
        throw new Error("Guarded route missing authenticated user.");
      }

      const response = await deleteUser({ db, userId: user.id });

      return mapRouteResult(response, {
        onError: (error) => status(404, error),
        onSuccess: (data) => data,
      });
    },
    {
      response: {
        200: deleteUserResponseSchema,
        401: unauthorizedConflictSchema,
        404: deleteUserConflictSchema,
      },
    },
  );

export const AuthModule = new Elysia({ prefix: "/auth" })
  .use(dbPlugin)
  .use(jwtPlugin)
  .post(
    "/register",
    async ({ body, status, db, jwt }) => {
      const response = await register({
        db,
        ...body,
        signToken: (id, tokenVersion) => jwt.sign({ id, tokenVersion }),
      });

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
      const response = await login({
        db,
        ...body,
        signToken: (id, tokenVersion) => jwt.sign({ id, tokenVersion }),
      });

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
  )
  .use(AuthProtectedRoutes);
