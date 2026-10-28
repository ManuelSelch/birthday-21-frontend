import { test } from "node:test";
import { AdminRoutesDriver } from "./support/admin-routes-driver";

test("guest data cannot be read without a session", async context => {
  const admin = await AdminRoutesDriver.create(context);

  await admin.readGuests();

  admin.thenStatus(401);
  admin.thenCockpitWasNotAccessed();
});

test("points and check-in cannot be changed without a session", async context => {
  const admin = await AdminRoutesDriver.create(context);

  await admin.changePoints();
  admin.thenStatus(401);
  await admin.checkIn();
  admin.thenStatus(401);
  admin.thenCockpitWasNotAccessed();
});

test("points cannot be changed through GET even with a session", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  await admin.attemptPointsThroughGet();

  admin.thenStatus(405);
  admin.thenCockpitWasNotAccessed();
});

test("authenticated requests retain guest/check-in contracts and disable caching", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  await admin.readGuests();
  admin.thenStatus(200);
  admin.thenPrivateResponse();
  await admin.checkIn();
  admin.thenStatus(200);
  admin.thenPrivateResponse();
});

test("points reject nonnumeric values and cross-site writes before Cockpit access", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  await admin.changePoints("42");
  admin.thenStatus(400);
  await admin.changePoints(42, "https://evil.test");
  admin.thenStatus(403);
  admin.thenCockpitWasNotAccessed();
});

test("valid authenticated points are saved", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  await admin.changePoints();

  admin.thenStatus(200);
  admin.thenPointsWereSaved();
});
