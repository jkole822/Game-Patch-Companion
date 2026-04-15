import { Resend } from "resend";

import { requireEnv } from "./env";

const getResetPasswordUrl = (token: string): string => {
  const url = new URL("/reset-password", requireEnv("APP_URL"));
  url.searchParams.set("token", token);
  return url.toString();
};

export const sendPasswordResetEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}): Promise<void> => {
  const resend = new Resend(requireEnv("RESEND_API_KEY"));
  const resetUrl = getResetPasswordUrl(token);

  const { error } = await resend.emails.send({
    from: requireEnv("RESEND_FROM_EMAIL"),
    html: `
      <p>You requested a password reset for Game Patch Companion.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
    subject: "Reset your Game Patch Companion password",
    text: [
      "You requested a password reset for Game Patch Companion.",
      `Reset your password: ${resetUrl}`,
      "If you did not request this, you can ignore this email.",
    ].join("\n\n"),
    to: email,
  });

  if (error) {
    throw new Error(error.message);
  }
};
