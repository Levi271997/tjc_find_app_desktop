// Client for API.Bible (https://docs.api.bible), used for copyrighted versions
// such as the NIV and NASB that cannot be bundled with the site. Server-only:
// the API key must never reach the browser.
//
// Environment variables (a version is unavailable until its ID is set):
//   API_BIBLE_KEY      your API.Bible key
//   API_BIBLE_NIV_ID   the NIV bibleId your key has access to
//   API_BIBLE_NASB_ID  the NASB bibleId (1995 or 2020 edition)
// List the bibleIds your key can use with GET https://rest.api.bible/v1/bibles.
import { cacheLife } from "next/cache";
import type { Verse } from "./index";

const BASE_URL = "https://rest.api.bible/v1";

const BIBLE_ID_ENV = {
  niv: "API_BIBLE_NIV_ID",
  nasb: "API_BIBLE_NASB_ID",
} as const;

export type ApiBibleVersion = keyof typeof BIBLE_ID_ENV;

export type ApiBibleChapter = {
  verses: Verse[];
  copyright: string | null;
  // Token for API.Bible's Fair Use Management System. Every page view of the
  // text must be reported with it (see src/components/bible/fums-tracker.tsx).
  fumsToken: string | null;
};

type ContentNode = {
  type?: string;
  name?: string;
  text?: string;
  attrs?: { verseId?: unknown };
  items?: ContentNode[];
};

type ChapterResponse = {
  data: { content: ContentNode[]; copyright?: string };
  meta?: { fumsToken?: string; fumsId?: string };
};

export function getApiBibleConfig(version: ApiBibleVersion) {
  const apiKey = process.env.API_BIBLE_KEY;
  const bibleId = process.env[BIBLE_ID_ENV[version]];

  return apiKey && bibleId ? { apiKey, bibleId } : null;
}

// Fetches one chapter, e.g. bookCode "JHN" and chapter 3. Results are cached
// so repeat visits don't count against the API.Bible request quota.
export async function fetchApiBibleChapter(
  version: ApiBibleVersion,
  bookCode: string,
  chapter: number,
): Promise<ApiBibleChapter> {
  "use cache";
  cacheLife("days");

  const config = getApiBibleConfig(version);
  if (!config) {
    throw new Error(`API.Bible is not configured for ${version}`);
  }

  const query = new URLSearchParams({
    "content-type": "json",
    "include-notes": "false",
    "include-titles": "false",
    "include-chapter-numbers": "false",
    "include-verse-numbers": "false",
    "include-verse-spans": "false",
  });
  const url = `${BASE_URL}/bibles/${config.bibleId}/chapters/${bookCode}.${chapter}?${query}`;

  const response = await fetch(url, { headers: { "api-key": config.apiKey } });
  if (!response.ok) {
    throw new Error(`API.Bible returned ${response.status} for ${bookCode}.${chapter}`);
  }

  const body: ChapterResponse = await response.json();

  return {
    verses: parseVerses(body.data.content),
    copyright: body.data.copyright?.trim() || null,
    fumsToken: body.meta?.fumsToken ?? body.meta?.fumsId ?? null,
  };
}

// Flattens API.Bible's JSON content into verses. Verse text lives in text
// nodes tagged with attrs.verseId ("JHN.3.16"); a verse can be split across
// several nodes (paragraphs, poetry lines, words of Jesus, etc.). Verses the
// version omits (e.g. NIV Matthew 17:21) simply don't appear.
export function parseVerses(content: ContentNode[]): Verse[] {
  const parts = new Map<number, string[]>();
  let lastVerse: number | null = null;

  function walk(nodes: ContentNode[]) {
    for (const node of nodes) {
      if (node.type === "text" && typeof node.text === "string") {
        const verseId = node.attrs?.verseId;
        if (typeof verseId !== "string") continue;

        const number = Number(verseId.split(".").pop());
        if (!Number.isInteger(number)) continue;

        if (!parts.has(number)) parts.set(number, []);
        parts.get(number)!.push(node.text);
        lastVerse = number;
      } else if (node.items && node.name !== "note") {
        walk(node.items);
        // Paragraph and poetry-line breaks carry no whitespace of their own.
        if (node.name === "para" && lastVerse !== null) parts.get(lastVerse)!.push(" ");
      }
    }
  }

  walk(content);

  return [...parts].map(([number, texts]) => ({
    number,
    text: texts.join("").replace(/\s+/g, " ").trim(),
  }));
}
