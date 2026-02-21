export const absolutizeUrl = (baseUrl: string, urlLike?: string): string => {
  if (!urlLike) return baseUrl;
  if (urlLike.startsWith("http")) {
    return urlLike;
  }

  return `${baseUrl}${urlLike.startsWith("/") ? "" : "/"}${urlLike}`;
};
