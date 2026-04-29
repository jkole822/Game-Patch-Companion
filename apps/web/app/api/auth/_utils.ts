import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/utils";

type ProxyAuthOptions = {
  body?: string;
  cookieHeader?: string | null;
  errorRedirectPath: string;
  method: "POST";
  request: Request;
  successRedirectPath: string;
  upstreamPath: string;
};

const getRedirectUrl = (request: Request, pathname: string, error?: string): URL => {
  const url = new URL(pathname, request.url);

  if (error) {
    url.searchParams.set("error", error);
  }

  return url;
};

const getProxyErrorMessage = async (
  response: Response,
  fallbackMessage: string,
): Promise<string> => {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;
  return payload?.message ?? fallbackMessage;
};

export const proxyAuthRequest = async ({
  body,
  cookieHeader,
  errorRedirectPath,
  method,
  request,
  successRedirectPath,
  upstreamPath,
}: ProxyAuthOptions): Promise<NextResponse> => {
  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}${upstreamPath}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body,
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return NextResponse.redirect(
      getRedirectUrl(request, errorRedirectPath, "Unable to reach the authentication service."),
      { status: 303 },
    );
  }

  if (!response.ok) {
    return NextResponse.redirect(
      getRedirectUrl(
        request,
        errorRedirectPath,
        await getProxyErrorMessage(response, "Unable to complete that request right now."),
      ),
      { status: 303 },
    );
  }

  const redirectResponse = NextResponse.redirect(getRedirectUrl(request, successRedirectPath), {
    status: 303,
  });

  const setCookieHeader = response.headers.get("set-cookie");

  if (setCookieHeader) {
    redirectResponse.headers.set("set-cookie", setCookieHeader);
  }

  return redirectResponse;
};
