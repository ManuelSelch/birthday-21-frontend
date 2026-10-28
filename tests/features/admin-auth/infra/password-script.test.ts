import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { verifyPassword } from "../../../../features/admin-auth/infra/security";

test("password setup script emits a hash accepted by the login verifier", async () => {
  const result = spawnSync(process.execPath, ["scripts/hash-admin-password.mjs"], {
    input: "setup test password", encoding: "utf8",
  });

  assert.equal(result.status, 0);
  assert.equal(await verifyPassword("setup test password", result.stdout.trim()), true);
  assert.equal(result.stdout.includes("setup test password"), false);
});

test("password setup script rejects short input without echoing it", () => {
  const result = spawnSync(process.execPath, ["scripts/hash-admin-password.mjs"], {
    input: "too-short", encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr.includes("too-short"), false);
});
