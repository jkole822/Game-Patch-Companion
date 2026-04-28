"use server";

import { getApiBaseUrl } from "@/lib/utils";

export interface ResetPasswordActionState {
  error: string | null;
  success: string | null;
}

const INITIAL_STATE: ResetPasswordActionState = {
  error: null,
  success: null,
};

export const resetPasswordAction = async (
  _: ResetPasswordActionState = INITIAL_STATE,
  formData: FormData,
): Promise<ResetPasswordActionState> => {
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const token = formData.get("token");

  if (typeof token !== "string" || !token) {
    return { error: "This reset link is missing a token.", success: null };
  }

  if (typeof password !== "string" || typeof confirmPassword !== "string") {
    return { error: "Please provide your new password.", success: null };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", success: null };
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, token }),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      return {
        error: payload?.message ?? "Unable to reset your password right now.",
        success: null,
      };
    }

    return {
      error: null,
      success: payload?.message ?? "Password reset successfully.",
    };
  } catch {
    return {
      error: "Unable to reset your password right now.",
      success: null,
    };
  }
};
