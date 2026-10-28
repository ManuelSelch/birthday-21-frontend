import { defineConfig } from "@playwright/test";
import { browserOrigin } from "./tests/ui/support/ports";

export default defineConfig({
  testDir: "./tests/ui",
  testMatch: process.env.ADMIN_TEST_PRODUCTION === "1" ? "admin-boundaries.spec.ts" : "*.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: { baseURL: browserOrigin, headless: true, actionTimeout: 15_000 },
  webServer: {
    command: "node --import tsx tests/ui/support/server.ts",
    url: browserOrigin,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
