import { describe, expect, it } from "bun:test";
import * as cheerio from "cheerio";

import { extractPublishedAt } from "./extractPublishedAt";

describe("extractPublishedAt", () => {
  it("parses Lodestone-style inline script timestamps", () => {
    const $ = cheerio.load(`
      <article>
        <time class="news__ic--topics">
          <span id="datetime-example">-</span>
          <script>
            document.getElementById('datetime-example').innerHTML = ldst_strftime(1777347000, 'YMDHM');
          </script>
        </time>
      </article>
    `);

    const publishedAt = extractPublishedAt({
      $,
      config: {
        contentFormat: "markdown",
        contentSelector: ".news__detail__wrapper",
        entrySelector: ".patchnote__list .minor_patch dt, .patchnote__list .minor_patch dd",
        linkSelector: "a",
        listPath: "/lodestone/special/patchnote_log/",
        publishedAtAttribute: "datetime",
        publishedAtSelector: "article.news__detail time.news__ic--topics",
        titleSelector: "a",
      },
    });

    expect(publishedAt?.toISOString()).toBe("2026-04-28T03:30:00.000Z");
  });
});
