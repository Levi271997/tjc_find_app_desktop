import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VersionSwitcher } from "@/components/bible/version-switcher";
import { type Book, getVersion, NEW_TESTAMENT, OLD_TESTAMENT, VERSIONS } from "@/lib/bible";

type Props = PageProps<"/bible/[version]">;

export function generateStaticParams() {
  return VERSIONS.map((version) => ({ version: version.slug }));
}

async function resolveVersion(params: Props["params"]) {
  const version = getVersion((await params).version);
  if (!version) notFound();
  return version;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const version = await resolveVersion(props.params);

  return {
    title: `Bible (${version.abbreviation}) · True Jesus Church`,
  };
}

function BookGrid({ title, books, versionSlug }: { title: string; books: Book[]; versionSlug: string }) {
  return (
    <section className="mt-12">
      <h2 className="font-heading text-2xl font-bold text-brand">{title}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <li key={book.slug}>
            <Link
              href={`/bible/${versionSlug}/${book.slug}/1`}
              className="flex items-baseline justify-between rounded-lg border border-line px-5 py-4 hover:border-brand hover:bg-brand-light"
            >
              <span className="font-heading font-semibold">{book.name}</span>
              <span className="text-sm text-muted">
                {book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function BibleIndexPage(props: Props) {
  const version = await resolveVersion(props.params);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold">Bible</h1>
          <p className="mt-3 text-muted">{version.name}</p>
        </div>
        <VersionSwitcher current={version.slug} pathFor={(slug) => `/bible/${slug}`} />
      </div>

      <BookGrid title="Old Testament" books={OLD_TESTAMENT} versionSlug={version.slug} />
      <BookGrid title="New Testament" books={NEW_TESTAMENT} versionSlug={version.slug} />
    </div>
  );
}
