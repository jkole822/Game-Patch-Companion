import { dbPlugin, jwtPlugin } from "@api-utils";
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

type RouteResult<TSuccess, TError> = { ok: true; data: TSuccess } | { ok: false; error: TError };

const mapRouteResult = <TSuccess, TError, TSuccessResult, TErrorResult>(
  response: RouteResult<TSuccess, TError>,
  {
    onError,
    onSuccess,
  }: {
    onError: (error: TError) => TErrorResult;
    onSuccess: (data: TSuccess) => TSuccessResult;
  },
): TErrorResult | TSuccessResult => {
  if ("error" in response) {
    return onError(response.error);
  }

  return onSuccess(response.data);
};

export const AuthModule = new Elysia({ prefix: "/auth" })
  .use(dbPlugin)
  .use(jwtPlugin)
  .post(
    "/register",
    async ({ body, status, db, jwt }) => {
      const response = await register({ db, jwt, ...body });

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
      const response = await login({ db, jwt, ...body });

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
