import type { StructuredLine } from "@api-jobs/ingest/ingest.types";
import type * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

const isLabelLike = (text: string) => {
  // Heuristic: short, no punctuation, title-case-ish, no trailing period
  if (!text) return false;
  if (text.length > 40) return false;
  if (/[.!?]/.test(text)) return false;
  if (/\d{2,}/.test(text)) return false; // avoid dates/versions becoming labels
  return true;
};

const normalizeText = (s: string) => s.replace(/\s+/g, " ").trim();

export const extractNestedListLines = (
  $: cheerio.CheerioAPI,
  basePath: string[] = [],
): StructuredLine[] => {
  const out: StructuredLine[] = [];

  const walkUl = ($ul: cheerio.Cheerio<AnyNode>, path: string[]) => {
    $ul.children("li").each((_, li) => {
      const $li = $(li);

      // "Own text" = text in this LI excluding any nested UL/OL
      const $clone = $li.clone();
      $clone.children("ul,ol").remove();
      // Also remove common wrappers that just hold nested lists
      const ownText = normalizeText($clone.text());

      const $childList = $li.children("ul,ol").first();

      if ($childList.length) {
        // If the LI is acting like a label, extend path and recurse
        if (isLabelLike(ownText)) {
          walkUl($childList, [...path, ownText]);
          return;
        }

        // Otherwise, emit the text as a line AND recurse into children with same path
        if (ownText) out.push({ path, text: ownText });
        walkUl($childList, path);
        return;
      }

      // Leaf bullet
      if (ownText) out.push({ path, text: ownText });
    });
  };

  $("ul,ol").each((_, ul) => {
    walkUl($(ul), basePath);
  });

  return out;
};
