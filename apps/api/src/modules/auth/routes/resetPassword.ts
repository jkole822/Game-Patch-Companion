import { and, eq, gt, isNull, ne, sql } from "@db/orm";
import { passwordResetTokens, users } from "@db/schema";
import { resetPasswordConflictSchema, resetPasswordResponseSchema } from "@shared/schemas";

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
  const passwordHash = await Bun.password.hash(password);
  const now = new Date();
  const tokenHash = hashResetToken(token);

  const claimedToken = await db.transaction(async (tx) => {
    const [currentToken] = await tx
      .update(passwordResetTokens)
      .set({
        usedAt: now,
      })
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          isNull(passwordResetTokens.usedAt),
          gt(passwordResetTokens.expiresAt, now),
        ),
      )
      .returning({
        id: passwordResetTokens.id,
        userId: passwordResetTokens.userId,
      });

    if (!currentToken) {
      return null;
    }

    await tx
      .update(users)
      .set({
        passwordHash,
        tokenVersion: sql`${users.tokenVersion} + 1`,
      })
      .where(eq(users.id, currentToken.userId));

    await tx
      .update(passwordResetTokens)
      .set({
        usedAt: now,
      })
      .where(
        and(
          eq(passwordResetTokens.userId, currentToken.userId),
          isNull(passwordResetTokens.usedAt),
          ne(passwordResetTokens.id, currentToken.id),
        ),
      );

    return currentToken;
  });

  if (!claimedToken) {
    return {
      ok: false,
      error: resetPasswordConflictSchema.parse({
        error: "INVALID_RESET_TOKEN",
        message: "This reset link is invalid or has expired.",
      }),
    };
  }

  return {
    ok: true,
    data: resetPasswordResponseSchema.parse({
      message: "Password reset successfully.",
    }),
  };
};
