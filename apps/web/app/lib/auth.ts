import { getApiBaseUrl } from "@/lib/utils";

type CookieStore = {
  get: (name: string) => { value: string } | undefined;
};

export const AUTH_COOKIE_NAME = "auth_token";

export type AuthUser = {
  email: string;
  id: string;
  role: "user" | "admin";
};

export const hasAuthCookie = (cookieStore: CookieStore): boolean => {
  return Boolean(cookieStore.get(AUTH_COOKIE_NAME)?.value);
};

export const getAuthCookieHeader = (cookieStore: CookieStore): string | null => {
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}`;
};

export const getCurrentUser = async (cookieStore: CookieStore): Promise<AuthUser | null> => {
  const authCookieHeader = getAuthCookieHeader(cookieStore);

  if (!authCookieHeader) {
    return null;
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    headers: {
      Cookie: authCookieHeader,
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch current user: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as AuthUser;
};
