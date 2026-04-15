import { sendPasswordResetEmail } from "@api-utils";
import { passwordResetTokens, users } from "@db/schema";
import { forgotPasswordResponseSchema } from "@shared/schemas";
import { eq } from "drizzle-orm";

import type { AppDb } from "@api-utils";
import type { forgotPasswordSchema } from "@shared/schemas";
import type { z } from "zod";

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
type ForgotPasswordSuccess = z.infer<typeof forgotPasswordResponseSchema>;
type ForgotPasswordResult = { ok: true; data: ForgotPasswordSuccess };

const PASSWORD_RESET_WINDOW_MS = 1000 * 60 * 60;

export const hashResetToken = (token: string): string => {
  return new Bun.CryptoHasher("sha256").update(token).digest("hex");
};

export const forgotPassword = async ({
  createToken = () => crypto.randomUUID(),
  db,
  email,
  sendResetEmail = sendPasswordResetEmail,
}: ForgotPasswordInput & {
  createToken?: () => string;
  db: AppDb;
  sendResetEmail?: ({ email, token }: { email: string; token: string }) => Promise<void>;
}): Promise<ForgotPasswordResult> => {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user) {
    const token = createToken();

    await db.insert(passwordResetTokens).values({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: hashResetToken(token),
      expiresAt: new Date(Date.now() + PASSWORD_RESET_WINDOW_MS),
      createdAt: new Date(),
    });

    await sendResetEmail({
      email,
      token,
    });
  }

  return {
    ok: true,
    data: forgotPasswordResponseSchema.parse({
      message: "If an account exists for that email, a reset link will be sent.",
    }),
  };
};
