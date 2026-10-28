import assert from "node:assert/strict";
import { test } from "node:test";
import { safeAdminDestination, SESSION_SECONDS } from "../../../../features/admin-auth/domain/rules";

test("accepts only canonical protected admin paths", () => {
  assert.equal(SESSION_SECONDS, 12 * 60 * 60);
  for (const path of ["/admin/guests", "/admin/scanner?mode=scan", "/admin"]) {
    assert.equal(safeAdminDestination(path), path);
  }

  for (const path of [undefined, "https://evil.test", "//evil.test/admin", "/admin/login", "/admin/login?next=x", "/administer", "/admin/../invite", "/admin/%2e%2e/invite", "/admin/%6cogin", "/admin/guests#x", "/admin/\\evil", "/admin//evil", "/admin/guests\n"]) {
    assert.equal(safeAdminDestination(path), "/admin/guests", String(path));
  }
});
