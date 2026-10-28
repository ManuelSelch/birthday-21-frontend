import assert from "node:assert/strict";
import { test } from "node:test";
import { readAuthConfig } from "../../../../features/admin-auth/infra/config";

const environment: NodeJS.ProcessEnv = {
  ADMIN_PASSWORD_HASH: "scrypt:" + "a".repeat(32) + ":" + "b".repeat(128),
  ADMIN_SESSION_SECRET: "s".repeat(64),
  APP_ORIGIN: "https://party.test",
  NODE_ENV: "production",
};

test("configuration accepts only complete secrets and exact production HTTPS origins", () => {
  assert.ok(readAuthConfig(environment));
  for (const overrides of [
    { ADMIN_PASSWORD_HASH: "" }, { ADMIN_PASSWORD_HASH: "plaintext" },
    { ADMIN_SESSION_SECRET: "short" }, { APP_ORIGIN: "http://party.test" },
    { APP_ORIGIN: "https://party.test/" }, { APP_ORIGIN: "https://user:pass@party.test" },
    { APP_ORIGIN: "https://party.test/path" }, { APP_ORIGIN: "" },
  ]) assert.equal(readAuthConfig({ ...environment, ...overrides }), undefined);
});

test("local HTTP is permitted only on loopback in development", () => {
  assert.ok(readAuthConfig({ ...environment, NODE_ENV: "development", APP_ORIGIN: "http://localhost:3000" }));
  assert.equal(readAuthConfig({ ...environment, NODE_ENV: "development", APP_ORIGIN: "http://public.test" }), undefined);
});
