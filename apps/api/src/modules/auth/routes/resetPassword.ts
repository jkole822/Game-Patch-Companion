import { passwordResetTokens, users } from "@db/schema";
import { resetPasswordConflictSchema, resetPasswordResponseSchema } from "@shared/schemas";
import { and, eq, gt, isNull, sql } from "drizzle-orm";

import { hashResetToken } from "./forgotPassword";

import type { AppDb } from "@api-utils";
import type { resetPasswordConflictSchema as resetPasswordConflictSchemaType } from "@shared/schemas";
import type { resetPasswordSchema } from "@shared/schemas";
import type { z } from "zod";

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
type ResetPasswordSuccess = z.infer<typeof resetPasswordResponseSchema>;
type ResetPasswordConflict = z.infer<typeof resetPasswordConflictSchemaType>;
type ResetPasswordResult =
  | { ok: true; data: ResetPasswordSuccess }
  | { ok: false; error: ResetPasswordConflict };

export const resetPassword = async ({
  db,
  password,
  token,
}: ResetPasswordInput & {
  db: AppDb;
}): Promise<ResetPasswordResult> => {
  const [resetToken] = await db
    .select({
      id: passwordResetTokens.id,
      userId: passwordResetTokens.userId,
    })
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.tokenHash, hashResetToken(token)),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!resetToken) {
    return {
      ok: false,
      error: resetPasswordConflictSchema.parse({
        error: "INVALID_RESET_TOKEN",
        message: "This reset link is invalid or has expired.",
      }),
    };
  }

  const passwordHash = await Bun.password.hash(password);

  await db
    .update(users)
    .set({
      passwordHash,
      tokenVersion: sql`${users.tokenVersion} + 1`,
    })
    .where(eq(users.id, resetToken.userId));

  await db
    .update(passwordResetTokens)
    .set({
      usedAt: new Date(),
    })
    .where(eq(passwordResetTokens.id, resetToken.id));

  return {
    ok: true,
    data: resetPasswordResponseSchema.parse({
      message: "Password reset successfully.",
    }),
  };
};
