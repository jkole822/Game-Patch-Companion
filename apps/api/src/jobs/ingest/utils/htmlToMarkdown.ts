import TurndownService from "turndown";

export const htmlToMarkdown = (html: string) => {
  const td = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
  });

  return td
    .turndown(html)
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
