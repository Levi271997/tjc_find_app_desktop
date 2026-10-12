import { readFile } from "node:fs/promises";
import path from "node:path";
import { BOOKS, type Book } from "./books";

export { BOOKS, type Book } from "./books";

export const TRANSLATION_NAME = "King James Version";

export const OLD_TESTAMENT = BOOKS.filter((book) => book.testament === "old");
export const NEW_TESTAMENT = BOOKS.filter((book) => book.testament === "new");

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((book) => book.slug === slug);
}

// Returns the verses of one chapter, indexed from 0 (verse 1 is verses[0]).
// Only call this from Server Components or Route Handlers.
export async function getChapter(book: Book, chapter: number): Promise<string[]> {
  const file = path.join(process.cwd(), "src/data/bible/kjv", `${book.slug}.json`);
  const chapters: string[][] = JSON.parse(await readFile(file, "utf8"));

  return chapters[chapter - 1];
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

export function allChapterParams() {
  return BOOKS.flatMap((book) =>
    Array.from({ length: book.chapters }, (_, index) => ({
      book: book.slug,
      chapter: String(index + 1),
    })),
  );
}
