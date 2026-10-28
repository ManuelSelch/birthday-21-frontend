import assert from "node:assert/strict";
import test from "node:test";
import Home from "../../app/page";

test("the home page redirects to the admin login", async () => {
  await assert.rejects(async () => Home(), {
    digest: "NEXT_REDIRECT;replace;/admin/login;307;",
  });
});
