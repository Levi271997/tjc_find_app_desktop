import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  redirects() {
    return [
      // The Bible lives under a version segment (/bible/kjv, /bible/niv).
      { source: "/bible", destination: "/bible/kjv", permanent: false },
      // Chapter URLs from before versions were added (/bible/john/3).
      { source: "/bible/:book/:chapter(\\d+)", destination: "/bible/kjv/:book/:chapter", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
