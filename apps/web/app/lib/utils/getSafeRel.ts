export const getSafeRel = (target?: string, rel?: string) => {
  if (target !== "_blank") {
    return rel;
  }

  const tokens = new Set((rel ?? "").split(/\s+/).filter(Boolean));
  tokens.add("noopener");
  tokens.add("noreferrer");

  return Array.from(tokens).join(" ");
};
