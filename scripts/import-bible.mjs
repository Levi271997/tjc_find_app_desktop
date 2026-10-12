// Splits a Bible JSON file into one file per book under src/data/bible/kjv/.
//
// Expected source: an array of books in Protestant order, each with
// `chapters` as an array of chapters, each chapter an array of verse strings
// (the format used by github.com/thiagobodruk/bible). Book names in the
// source are ignored; names come from src/lib/bible/books.ts.
//
// Usage: node scripts/import-bible.mjs <path-to-source.json>

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = process.argv[2];

if (!sourcePath) {
  console.error("Usage: node scripts/import-bible.mjs <path-to-source.json>");
  process.exit(1);
}

const booksFile = await readFile(path.join(root, "src/lib/bible/books.ts"), "utf8");
const expected = [...booksFile.matchAll(/slug: "([^"]+)".*chapters: (\d+)/g)].map(
  ([, slug, chapters]) => ({ slug, chapters: Number(chapters) }),
);

const source = JSON.parse(await readFile(sourcePath, "utf8"));

if (source.length !== expected.length) {
  throw new Error(`Expected ${expected.length} books, source has ${source.length}`);
}

const outDir = path.join(root, "src/data/bible/kjv");
await mkdir(outDir, { recursive: true });

let verseCount = 0;

for (const [index, book] of source.entries()) {
  const { slug, chapters } = expected[index];

  if (book.chapters.length !== chapters) {
    throw new Error(`${slug}: expected ${chapters} chapters, source has ${book.chapters.length}`);
  }

  verseCount += book.chapters.reduce((total, chapter) => total + chapter.length, 0);
  await writeFile(path.join(outDir, `${slug}.json`), JSON.stringify(book.chapters) + "\n");
}

console.log(`Wrote ${source.length} books and ${verseCount} verses to src/data/bible/kjv/`);
