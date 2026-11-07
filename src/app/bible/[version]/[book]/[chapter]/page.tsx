import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FumsTracker } from "@/components/bible/fums-tracker";
import { VersionSwitcher } from "@/components/bible/version-switcher";
import {
  allChapterParams,
  getBook,
  getChapter,
  getChapterNeighbours,
  getVersion,
  VERSIONS,
} from "@/lib/bible";

type Props = PageProps<"/bible/[version]/[book]/[chapter]">;

// Bundled versions are prerendered at build time. API-backed versions (NIV)
// render on first visit and are then cached, so the build doesn't spend
// ~1,200 API.Bible requests or need the API key.
export function generateStaticParams() {
  return VERSIONS.filter((version) => version.source === "local").flatMap(allChapterParams);
}

async function resolveChapter(params: Props["params"]) {
  const { version: versionSlug, book: bookSlug, chapter: chapterParam } = await params;
  const version = getVersion(versionSlug);
  const book = getBook(bookSlug);
  const chapter = Number(chapterParam);

  if (!version || !book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) {
    notFound();
  }

  return { version, book, chapter };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { version, book, chapter } = await resolveChapter(props.params);

  return {
    title: `${book.name} ${chapter} (${version.abbreviation}) · Bible · True Jesus Church`,
  };
}

export default function BibleChapterPage(props: Props) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-12 text-muted">Loading chapter…</div>}>
      <ChapterContent params={props.params} />
    </Suspense>
  );
}

async function ChapterContent({ params }: Pick<Props, "params">) {
  const { version, book, chapter } = await resolveChapter(params);
  const result = await getChapter(version, book, chapter);
  const { prev, next } = getChapterNeighbours(book, chapter);
  const base = `/bible/${version.slug}`;

  const navLinkClass =
    "rounded border border-line px-4 py-2 text-sm font-semibold hover:border-brand hover:text-brand";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href={base} className="hover:text-brand">
          Bible
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{book.name}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold">
            {book.name} {chapter}
          </h1>
          <p className="mt-2 text-sm text-muted">{version.name}</p>
        </div>
        <VersionSwitcher
          current={version.slug}
          pathFor={(slug) => `/bible/${slug}/${book.slug}/${chapter}`}
        />
      </div>

      {result.status === "ok" ? (
        <>
          <ol className="mt-8 space-y-3 text-lg leading-relaxed">
            {result.verses.map((verse) => (
              <li key={verse.number} className="flex gap-3">
                <span className="w-6 shrink-0 pt-1 text-right font-heading text-sm font-bold text-brand select-none">
                  {verse.number}
                </span>
                <span>{verse.text}</span>
              </li>
            ))}
          </ol>
          {result.copyright && <p className="mt-8 text-xs text-muted">{result.copyright}</p>}
          {result.fumsToken && <FumsTracker token={result.fumsToken} />}
        </>
      ) : (
        <div className="mt-8 rounded-lg border border-line bg-brand-light px-5 py-4">
          <p className="font-semibold">
            The {version.abbreviation} text isn&apos;t available right now.
          </p>
          <p className="mt-1 text-sm text-muted">
            {result.reason === "not-configured"
              ? "This site hasn't been connected to API.Bible yet."
              : "Please try again in a moment."}{" "}
            <Link href={`/bible/kjv/${book.slug}/${chapter}`} className="text-brand underline">
              Read {book.name} {chapter} in the King James Version
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-12 flex items-center justify-between gap-4">
        {prev ? (
          <Link href={`${base}/${prev.book.slug}/${prev.chapter}`} className={navLinkClass}>
            ← {prev.book.name} {prev.chapter}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`${base}/${next.book.slug}/${next.chapter}`} className={navLinkClass}>
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
                href={`${base}/${book.slug}/${n}`}
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
