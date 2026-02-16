import { users } from "@db/schema";
import { loginResponseSchema } from "@shared/auth";
import { eq } from "drizzle-orm";

import type { AppDb, JwtType } from "@api-utils";
import type { loginSchema, loginConflictSchema } from "@shared/auth";
import type { z } from "zod";

type LoginInput = z.infer<typeof loginSchema>;
type LoginSuccess = z.infer<typeof loginResponseSchema>;
type LoginConflict = z.infer<typeof loginConflictSchema>;

type LoginResult = { ok: true; data: LoginSuccess } | { ok: false; error: LoginConflict };

const INVALID_CREDENTIALS_ERROR: LoginConflict = {
  error: "INVALID_CREDENTIALS",
  message: "Invalid credentials.",
};

export const login = async ({
  db,
  email,
  jwt,
  password,
}: LoginInput & { db: AppDb; jwt: JwtType }): Promise<LoginResult> => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user) {
    return {
      ok: false,
      error: INVALID_CREDENTIALS_ERROR,
    };
  }

  const isVerified = await Bun.password.verify(password, user.passwordHash);

  if (!isVerified) {
    return {
      ok: false,
      error: INVALID_CREDENTIALS_ERROR,
    };
  }

  const token = await jwt.decorator.jwt.sign({ id: user.id });

  return {
    ok: true,
    data: loginResponseSchema.parse({
      token,
    }),
  };
};
