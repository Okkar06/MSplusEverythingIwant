import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The e2e tests build into their own folder (see playwright.config.ts), so
  // they never share .next with a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // The service worker (public/sw.js), per the Next.js PWA guide: never
  // cached, so a new version is picked up on the next visit, and only allowed
  // to run this origin's code.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
