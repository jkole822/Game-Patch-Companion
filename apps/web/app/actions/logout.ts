"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getApiBaseUrl = (): string => {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
};

export const logoutAction = async (): Promise<void> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    await fetch(`${getApiBaseUrl()}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }).catch(() => null);
  }

  cookieStore.delete("auth_token");

  redirect("/login");
};
