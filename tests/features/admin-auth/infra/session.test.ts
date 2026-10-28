import assert from "node:assert/strict";
import { test } from "node:test";
import { passwordMatches } from "../../../../features/admin-auth/infra/session";

test("password comparison is direct and preserves spaces", context => {
  const original = process.env;
  process.env = { ...original, ADMIN_PASSWORD: " party " };
  context.after(() => { process.env = original; });

  assert.equal(passwordMatches(" party "), true);
  assert.equal(passwordMatches("party"), false);
  assert.equal(passwordMatches(undefined), false);
  assert.equal(passwordMatches({ password: " party " }), false);
});
