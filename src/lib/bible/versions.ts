// Bible versions the site can show. KJV is public domain and bundled as
// static JSON; NIV is copyrighted by Biblica and fetched from API.Bible at
// request time (see ./api-bible.ts).
export type VersionSlug = "kjv" | "niv";

export type Version = {
  slug: VersionSlug;
  abbreviation: string;
  name: string;
  source: "local" | "api-bible";
};

export const VERSIONS: Version[] = [
  { slug: "kjv", abbreviation: "KJV", name: "King James Version", source: "local" },
  { slug: "niv", abbreviation: "NIV", name: "New International Version", source: "api-bible" },
];

export const DEFAULT_VERSION: VersionSlug = "kjv";

export function getVersion(slug: string): Version | undefined {
  return VERSIONS.find((version) => version.slug === slug);
}
