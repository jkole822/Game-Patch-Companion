import type { StructuredLine } from "@api-jobs/ingest/ingest.types";
import type * as cheerio from "cheerio";

export const extractHeadingsAndListLines = ($: cheerio.CheerioAPI): StructuredLine[] => {
  const lines: StructuredLine[] = [];
  const headingStack: { level: number; text: string }[] = [];

  const pushHeading = (level: number, text: string) => {
    // pop headings at same or deeper level
    while (headingStack.length && headingStack[headingStack.length - 1]!.level >= level) {
      headingStack.pop();
    }

    headingStack.push({ level, text });
  };

  $("h1,h2,h3,h4,h5,h6,li").each((_, el) => {
    const node = $(el);
    const tag = el.tagName?.toLowerCase();

    if (tag?.startsWith("h")) {
      const level = Number(tag.slice(1));
      const text = node.text().trim().replace(/\s+/g, " ");
      if (text) pushHeading(level, text);
      return;
    }

    if (tag === "li") {
      const clone = node.clone();
      clone.find("ul,ol").remove(); // leaf text only
      const text = clone.text().trim().replace(/\s+/g, " ");
      if (!text) return;

      const path = headingStack.map((h) => h.text);
      lines.push({ path, text });
    }
  });

  return lines;
};
