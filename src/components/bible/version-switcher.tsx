import Link from "next/link";
import { VERSIONS, type VersionSlug } from "@/lib/bible";

// Links to the same page in each Bible version. `pathFor` builds the path for a
// given version, so this works on both the book index and chapter pages.
export function VersionSwitcher({
  current,
  pathFor,
}: {
  current: VersionSlug;
  pathFor: (version: VersionSlug) => string;
}) {
  return (
    <nav aria-label="Bible version" className="inline-flex rounded border border-line p-1">
      {VERSIONS.map((version) => {
        const active = version.slug === current;

        return (
          <Link
            key={version.slug}
            href={pathFor(version.slug)}
            aria-current={active ? "page" : undefined}
            title={version.name}
            className={`rounded px-3 py-1 font-heading text-sm font-semibold ${
              active ? "bg-brand text-white" : "text-muted hover:text-brand"
            }`}
          >
            {version.abbreviation}
          </Link>
        );
      })}
    </nav>
  );
}
