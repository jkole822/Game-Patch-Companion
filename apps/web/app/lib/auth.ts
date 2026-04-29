type CookieStore = {
  get: (name: string) => { value: string } | undefined;
};

export const AUTH_COOKIE_NAME = "auth_token";

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
