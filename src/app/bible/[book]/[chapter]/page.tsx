import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  allChapterParams,
  getBook,
  getChapter,
  getChapterNeighbours,
  TRANSLATION_NAME,
} from "@/lib/bible";

export function generateStaticParams() {
  return allChapterParams();
}

async function resolveChapter(params: PageProps<"/bible/[book]/[chapter]">["params"]) {
  const { book: bookSlug, chapter: chapterParam } = await params;
  const book = getBook(bookSlug);
  const chapter = Number(chapterParam);

  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) {
    notFound();
  }

  return { book, chapter };
}

export async function generateMetadata(
  props: PageProps<"/bible/[book]/[chapter]">,
): Promise<Metadata> {
  const { book, chapter } = await resolveChapter(props.params);

  return {
    title: `${book.name} ${chapter} · Bible · True Jesus Church`,
  };
}

export default function BibleChapterPage(props: PageProps<"/bible/[book]/[chapter]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-12 text-muted">Loading chapter…</div>}>
      <ChapterContent params={props.params} />
    </Suspense>
  );
}

async function ChapterContent({ params }: Pick<PageProps<"/bible/[book]/[chapter]">, "params">) {
  const { book, chapter } = await resolveChapter(params);
  const verses = await getChapter(book, chapter);
  const { prev, next } = getChapterNeighbours(book, chapter);

  const navLinkClass =
    "rounded border border-line px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/bible" className="hover:text-brand">
          Bible
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{book.name}</span>
      </nav>

      <h1 className="mt-4 font-heading text-4xl font-bold">
        {book.name} {chapter}
      </h1>
      <p className="mt-2 text-sm text-muted">{TRANSLATION_NAME}</p>

      <ol className="mt-8 space-y-3 text-lg leading-relaxed">
        {verses.map((text, index) => (
          <li key={index} className="flex gap-3">
            <span className="w-6 shrink-0 pt-1 text-right font-heading text-sm font-bold text-brand select-none">
              {index + 1}
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex items-center justify-between gap-4">
        {prev ? (
          <Link href={`/bible/${prev.book.slug}/${prev.chapter}`} className={navLinkClass}>
            ← {prev.book.name} {prev.chapter}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/bible/${next.book.slug}/${next.chapter}`} className={navLinkClass}>
            {next.book.name} {next.chapter} →
          </Link>
        ) : (
          <span />
        )}
      </div>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="font-heading text-lg font-bold">Chapters in {book.name}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: book.chapters }, (_, index) => index + 1).map((n) => (
            <li key={n}>
              <Link
                href={`/bible/${book.slug}/${n}`}
                aria-current={n === chapter ? "page" : undefined}
                className={`block min-w-10 rounded px-3 py-2 text-center text-sm font-semibold ${
                  n === chapter ? "bg-brand text-white" : "bg-brand-light text-brand hover:bg-brand hover:text-white"
                }`}
              >
                {n}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
