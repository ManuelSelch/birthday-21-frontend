import { test, beforeEach, type TestContext } from "node:test";
import { AuthDriver } from "./support/auth-driver";

let admin: AuthDriver;
beforeEach(context => { admin = new AuthDriver(context as TestContext); });

test("one plain password is enough for login without hashing, an origin or another secret", async () => {
  await admin.login();
  admin.thenStatus(200);
  admin.thenCookieIsSecure();
  await admin.thenDestination("/admin/points");

  await admin.openProtectedApi();
  admin.thenStatus(200);
});

test("wrong passwords do not grant access", async () => {
  await admin.login("wrong");
  admin.thenStatus(401);

  await admin.openProtectedApi();
  admin.thenStatus(401);
});

test("missing and empty admin passwords do not allow login", async () => {
  admin.removePassword();
  await admin.login("");
  admin.thenStatus(503);
  await admin.openProtectedApi();
  admin.thenStatus(401);

  admin.useEmptyPassword();
  await admin.login("");
  admin.thenStatus(503);
});

test("logout clears the cookie and blocks subsequent requests", async () => {
  await admin.login();
  await admin.logout();
  admin.thenStatus(200);
  admin.thenCookieIsCleared();

  await admin.openProtectedApi();
  admin.thenStatus(401);
});

test("sessions expire after twelve hours", async () => {
  await admin.login();
  admin.expireSession();

  await admin.openProtectedApi();
  admin.thenStatus(401);
});

test("invalid cookies do not grant access", async () => {
  await admin.login();
  admin.tamperWithSession();

  await admin.openProtectedApi();
  admin.thenStatus(401);
});

test("changing the plain admin password invalidates existing cookies", async () => {
  await admin.login();
  admin.changePassword();

  await admin.openProtectedApi();
  admin.thenStatus(401);
});

test("external return destinations resolve to guests", async () => {
  await admin.login("party", "//evil.test");

  await admin.thenDestination("/admin/guests");
});

test("a wrong password does not lock out a subsequent correct login", async () => {
  for (let attempt = 0; attempt < 12; attempt++) await admin.login("wrong");

  await admin.login();
  admin.thenStatus(200);
});
