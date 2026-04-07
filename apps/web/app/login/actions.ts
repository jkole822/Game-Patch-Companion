"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AuthFormActionState } from "@/components/composites/AuthForm/AuthForm.types";

const INITIAL_STATE: AuthFormActionState = {
  error: null,
};

const getApiBaseUrl = (): string => {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
};

export const loginAction = async (
  _: AuthFormActionState = INITIAL_STATE,
  formData: FormData,
): Promise<AuthFormActionState> => {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Please provide an email and password." };
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as {
    message?: string;
    token?: string;
  } | null;

  if (!response.ok || !payload?.token) {
    return {
      error: payload?.message ?? "Unable to log you in right now.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("auth_token", payload.token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/dashboard");
};
