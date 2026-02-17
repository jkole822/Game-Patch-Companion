import { jwt } from "@elysiajs/jwt";

import { requireEnv } from "./env";

export const jwtPlugin = jwt({ name: "jwt", secret: requireEnv("JWT_SECRET") });
