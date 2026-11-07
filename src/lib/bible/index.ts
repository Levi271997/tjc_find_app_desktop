import { readFile } from "node:fs/promises";
import path from "node:path";
import { fetchApiBibleChapter, getApiBibleConfig } from "./api-bible";
import { BOOKS, type Book } from "./books";
import type { Version } from "./versions";

export { BOOKS, type Book } from "./books";
export { DEFAULT_VERSION, getVersion, VERSIONS, type Version, type VersionSlug } from "./versions";

export type Verse = { number: number; text: string };

export type Chapter =
  | {
      status: "ok";
      verses: Verse[];
      copyright: string | null;
      fumsToken: string | null;
    }
  // The text can't be shown right now: the version isn't configured on this
  // deployment, or the remote API failed.
  | { status: "unavailable"; reason: "not-configured" | "fetch-failed" };

export const OLD_TESTAMENT = BOOKS.filter((book) => book.testament === "old");
export const NEW_TESTAMENT = BOOKS.filter((book) => book.testament === "new");

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((book) => book.slug === slug);
}

// Returns the verses of one chapter. Only call this from Server Components or
// Route Handlers.
export async function getChapter(version: Version, book: Book, chapter: number): Promise<Chapter> {
  if (version.source === "local") {
    const file = path.join(process.cwd(), "src/data/bible", version.slug, `${book.slug}.json`);
    const chapters: string[][] = JSON.parse(await readFile(file, "utf8"));
    const verses = chapters[chapter - 1].map((text, index) => ({ number: index + 1, text }));

    return { status: "ok", verses, copyright: null, fumsToken: null };
  }

  const apiVersion = version.slug as Parameters<typeof getApiBibleConfig>[0];
  if (!getApiBibleConfig(apiVersion)) {
    return { status: "unavailable", reason: "not-configured" };
  }

  try {
    return { status: "ok", ...(await fetchApiBibleChapter(apiVersion, book.usfm, chapter)) };
  } catch (error) {
    console.error(`Failed to load ${version.abbreviation} ${book.name} ${chapter}`, error);
    return { status: "unavailable", reason: "fetch-failed" };
  }
}

// Previous and next chapter, crossing book boundaries. Either side is null at
// Genesis 1 and Revelation 22.
export function getChapterNeighbours(book: Book, chapter: number) {
  const bookIndex = BOOKS.indexOf(book);

  const prev =
    chapter > 1
      ? { book, chapter: chapter - 1 }
      : bookIndex > 0
        ? { book: BOOKS[bookIndex - 1], chapter: BOOKS[bookIndex - 1].chapters }
        : null;

  const next =
    chapter < book.chapters
      ? { book, chapter: chapter + 1 }
      : bookIndex < BOOKS.length - 1
        ? { book: BOOKS[bookIndex + 1], chapter: 1 }
        : null;

  return { prev, next };
}

export function allChapterParams(version: Version) {
  return BOOKS.flatMap((book) =>
    Array.from({ length: book.chapters }, (_, index) => ({
      version: version.slug,
      book: book.slug,
      chapter: String(index + 1),
    })),
  );
}
