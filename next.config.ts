import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The e2e tests build into their own folder (see playwright.config.ts), so
  // they never share .next with a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
