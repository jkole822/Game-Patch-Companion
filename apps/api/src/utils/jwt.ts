import { jwt as JWT } from "@elysiajs/jwt";
import { Elysia } from "elysia";

import { requireEnv } from "./env";

const jwt = JWT({ name: "jwt", secret: requireEnv("JWT_SECRET") });

export const jwtPlugin = new Elysia({ name: "jwt" }).decorate("jwt", jwt);

export type JwtType = typeof jwt;
