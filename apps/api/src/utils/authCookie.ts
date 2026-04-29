export const AUTH_COOKIE_NAME = "auth_token";

const getBaseCookieAttributes = (): string[] => {
  const attributes = ["HttpOnly", "Path=/", "SameSite=Lax"];

  if (process.env.NODE_ENV === "production") {
    attributes.push("Secure");

    if (process.env.AUTH_COOKIE_DOMAIN) {
      attributes.push(`Domain=${process.env.AUTH_COOKIE_DOMAIN}`);
    }
  }

  return attributes;
};

export const createAuthCookieHeader = (token: string): string => {
  return [`${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}`, ...getBaseCookieAttributes()].join(
    "; ",
  );
};

export const createClearedAuthCookieHeader = (): string => {
  return [
    `${AUTH_COOKIE_NAME}=`,
    ...getBaseCookieAttributes(),
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "Max-Age=0",
  ].join("; ");
};

export const getAuthTokenFromCookieHeader = (
  cookieHeader: string | null | undefined,
): string | null => {
  if (!cookieHeader) {
    return null;
  }

  for (const cookiePart of cookieHeader.split(";")) {
    const trimmedPart = cookiePart.trim();

    if (!trimmedPart.startsWith(`${AUTH_COOKIE_NAME}=`)) {
      continue;
    }

    const rawValue = trimmedPart.slice(AUTH_COOKIE_NAME.length + 1);

    if (!rawValue) {
      return null;
    }

    try {
      return decodeURIComponent(rawValue);
    } catch {
      return rawValue;
    }
  }

  return null;
};
