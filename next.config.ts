import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep isolated browser-test builds separate from the normal dev server.
  distDir: process.env.NEXT_TEST_DIST_DIR || ".next",
  experimental: { agentUpgrade: "security" },
};

export default nextConfig;
