import { users } from "@db/schema";
import { registerConflictSchema, registerResponseSchema } from "@shared/auth";

import type { AppDb } from "@api-utils";
import type { registerSchema } from "@shared/auth";
import type { z } from "zod";

type RegisterInput = z.infer<typeof registerSchema>;
type RegisterSuccess = z.infer<typeof registerResponseSchema>;
type RegisterConflict = z.infer<typeof registerConflictSchema>;

type RegisterResult = { ok: true; data: RegisterSuccess } | { ok: false; error: RegisterConflict };

export const register = async ({
  db,
  email,
  password,
  signToken,
}: RegisterInput & {
  db: AppDb;
  signToken: (id: string) => Promise<string>;
}): Promise<RegisterResult> => {
  const passwordHash = await Bun.password.hash(password);

  try {
    const [createdUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email,
        passwordHash,
        createdAt: new Date(),
      })
      .returning({
        id: users.id,
        email: users.email,
        createdAt: users.createdAt,
      });

    if (!createdUser) {
      throw new Error("Failed to create user");
    }

    const token = await signToken(createdUser.id);

    return {
      ok: true,
      data: registerResponseSchema.parse({
        id: createdUser.id,
        email: createdUser.email,
        createdAt: createdUser.createdAt.toISOString(),
        token,
      }),
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return {
        ok: false,
        error: registerConflictSchema.parse({
          error: "EMAIL_ALREADY_EXISTS",
          message: "An account with this email already exists.",
        }),
      };
    }

    throw error;
  }
};
