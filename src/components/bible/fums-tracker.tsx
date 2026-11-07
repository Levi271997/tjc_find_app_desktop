"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    fums?: (...args: unknown[]) => void;
    fumsData?: unknown[];
  }
}

// Reports a view of API.Bible content to its Fair Use Management System, which
// API.Bible requires for every web page that shows licensed text such as the
// NIV. See https://docs.api.bible/resources/fair-use.
export function FumsTracker({ token }: { token: string }) {
  useEffect(() => {
    // Queue calls until the script loads; it drains window.fumsData.
    window.fumsData = window.fumsData || [];
    window.fums =
      window.fums ||
      function (...args: unknown[]) {
        window.fumsData!.push(args);
      };

    window.fums("trackView", token);
  }, [token]);

  return <Script src="https://pkg.api.bible/fumsV3.min.js" strategy="afterInteractive" />;
}
