import type { Metadata } from "next";
import Link from "next/link";
import { type Book, NEW_TESTAMENT, OLD_TESTAMENT, TRANSLATION_NAME } from "@/lib/bible";

export const metadata: Metadata = {
  title: "Bible · True Jesus Church",
};

function BookGrid({ title, books }: { title: string; books: Book[] }) {
  return (
    <section className="mt-12">
      <h2 className="font-heading text-2xl font-bold text-brand">{title}</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <li key={book.slug}>
            <Link
              href={`/bible/${book.slug}/1`}
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

export default function BibleIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-heading text-4xl font-bold">Bible</h1>
      <p className="mt-3 text-muted">{TRANSLATION_NAME}</p>

      <BookGrid title="Old Testament" books={OLD_TESTAMENT} />
      <BookGrid title="New Testament" books={NEW_TESTAMENT} />
    </div>
  );
}
