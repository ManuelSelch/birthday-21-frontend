import { test, beforeEach } from "node:test";
import { AuthDriver } from "./support/auth-driver";

let admin: AuthDriver;
beforeEach(() => { admin = new AuthDriver(); });

test("page redirects use the configured origin rather than a normalized server hostname", () => {
  admin.thenRedirectUsesConfiguredOrigin();
});

test("login issues a secure cookie and permits authenticated reads", async () => {
  await admin.login();
  await admin.thenStatus(200);
  admin.thenCookieIsSecure();
  await admin.thenDestination("/admin/points");

  await admin.openProtectedApi();
  await admin.thenStatus(200);
});

test("wrong credentials do not grant access", async () => {
  await admin.login("wrong");
  await admin.thenStatus(401);

  await admin.openProtectedApi();
  await admin.thenStatus(401);
});

test("missing configuration fails closed", async () => {
  admin.removeConfiguration();

  await admin.login();
  await admin.thenStatus(503);
  await admin.openProtectedApi();
  await admin.thenStatus(401);
});

test("rejects cross-site or missing-origin mutations", async () => {
  await admin.login();
  await admin.openProtectedApi(true, "https://evil.test");
  await admin.thenStatus(403);

  await admin.openProtectedApi(true);
  await admin.thenStatus(403);
  await admin.openProtectedApi(true, "https://party.test");
  await admin.thenStatus(200);
});

test("login rejects cross-site submissions", async () => {
  await admin.login("party test password", "https://evil.test");
  await admin.thenStatus(403);
});

test("logout requires same-origin submission and expires the cookie", async () => {
  await admin.login();
  await admin.logout("https://evil.test");
  await admin.thenStatus(403);

  await admin.logout();
  await admin.thenStatus(200);
  admin.thenCookieIsCleared();
  await admin.openProtectedApi();
  await admin.thenStatus(401);
});

test("rejects expired sessions", async () => {
  await admin.login();
  admin.expireSession();

  await admin.openProtectedApi();
  await admin.thenStatus(401);
});

test("rejects tampered and future-issued sessions", async () => {
  await admin.login();
  admin.tamperWithSession();
  await admin.openProtectedApi();
  await admin.thenStatus(401);

  admin.useFutureSession();
  await admin.openProtectedApi();
  await admin.thenStatus(401);
});

test("external and login return destinations resolve to guests", async () => {
  await admin.login("party test password", "https://party.test", "//evil.test");
  await admin.thenDestination("/admin/guests");
});

test("too many login attempts return a bounded retry response", async () => {
  for (let attempt = 0; attempt < 10; attempt++) await admin.login("wrong");

  await admin.login();
  await admin.thenStatus(429);
  admin.thenRetryIsAvailable();
});
