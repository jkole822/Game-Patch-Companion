import {
  authContext,
  authGuard,
  createAuthCookieHeader,
  createClearedAuthCookieHeader,
  dbPlugin,
  jwtPlugin,
  mapRouteResult,
} from "@api-utils";
import {
  deleteUserConflictSchema,
  deleteUserResponseSchema,
  forgotPasswordResponseSchema,
  loginConflictSchema,
  loginResponseSchema,
  loginSchema,
  logoutResponseSchema,
  forgotPasswordSchema,
  registerConflictSchema,
  registerResponseSchema,
  registerSchema,
  resetPasswordConflictSchema,
  resetPasswordResponseSchema,
  resetPasswordSchema,
  unauthorizedConflictSchema,
} from "@shared/schemas";
import { Elysia } from "elysia";

import { deleteUser, forgotPassword, login, logout, register, resetPassword } from "./routes";

const AuthProtectedRoutes = new Elysia()
  .use(dbPlugin)
  .use(authContext)
  .use(authGuard)
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
  .use(authContext)
  .post(
    "/logout",
    async ({ db, set, user }) => {
      if (user) {
        await logout({ db, userId: user.id });
      }

      set.headers["set-cookie"] = createClearedAuthCookieHeader();

      return logoutResponseSchema.parse({
        message: "Logged out successfully.",
      });
    },
    {
      response: {
        200: logoutResponseSchema,
      },
    },
  )
  .post(
    "/register",
    async ({ body, set, status, db, jwt }) => {
      const response = await register({
        db,
        ...body,
        signToken: (id, tokenVersion) => jwt.sign({ id, tokenVersion }),
      });

      return mapRouteResult(response, {
        onError: (error) => status(400, error),
        onSuccess: ({ authToken, response }) => {
          set.headers["set-cookie"] = createAuthCookieHeader(authToken);
          return status(201, response);
        },
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
    async ({ body, set, status, db, jwt }) => {
      const response = await login({
        db,
        ...body,
        signToken: (id, tokenVersion) => jwt.sign({ id, tokenVersion }),
      });

      return mapRouteResult(response, {
        onError: (error) => status(400, error),
        onSuccess: ({ authToken, response }) => {
          set.headers["set-cookie"] = createAuthCookieHeader(authToken);
          return response;
        },
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
  .post(
    "/forgot-password",
    async ({ body, db }) => {
      const response = await forgotPassword({
        db,
        ...body,
      });

      return response.data;
    },
    {
      body: forgotPasswordSchema,
      response: {
        200: forgotPasswordResponseSchema,
      },
    },
  )
  .post(
    "/reset-password",
    async ({ body, status, db }) => {
      const response = await resetPassword({
        db,
        ...body,
      });

      return mapRouteResult(response, {
        onError: (error) => status(400, error),
        onSuccess: (data) => data,
      });
    },
    {
      body: resetPasswordSchema,
      response: {
        200: resetPasswordResponseSchema,
        400: resetPasswordConflictSchema,
      },
    },
  )
  .use(AuthProtectedRoutes);
