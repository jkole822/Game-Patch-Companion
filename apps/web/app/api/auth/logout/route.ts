import { cookies } from "next/headers";

import { getAuthCookieHeader } from "@/lib/auth";

import { proxyAuthRequest } from "../_utils";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  return proxyAuthRequest({
    cookieHeader: getAuthCookieHeader(cookieStore),
    errorRedirectPath: "/login",
    method: "POST",
    request,
    successRedirectPath: "/login",
    upstreamPath: "/auth/logout",
  });
}
