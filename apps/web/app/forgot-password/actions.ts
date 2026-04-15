"use server";

import { getApiBaseUrl } from "@/lib/utils";

export interface ForgotPasswordActionState {
  error: string | null;
  success: string | null;
}

const INITIAL_STATE: ForgotPasswordActionState = {
  error: null,
  success: null,
};

export const forgotPasswordAction = async (
  _: ForgotPasswordActionState = INITIAL_STATE,
  formData: FormData,
): Promise<ForgotPasswordActionState> => {
  const email = formData.get("email");

  if (typeof email !== "string") {
    return { error: "Please provide your email address.", success: null };
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    return {
      error: payload?.message ?? "Unable to start the reset process right now.",
      success: null,
    };
  }

  return {
    error: null,
    success: payload?.message ?? "If an account exists, a reset link will be sent.",
  };
};
