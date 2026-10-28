import { test } from "node:test";
import { AdminRoutesDriver } from "./support/admin-routes-driver";

test("guest creation requires a session before Cockpit access", async context => {
  const admin = await AdminRoutesDriver.create(context);

  await admin.addGuest();

  admin.thenStatus(401);
  admin.thenCockpitWasNotAccessed();
});

test("invalid names and non-object bodies never reach Cockpit", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  for (const body of [{}, { name: 42 }, { name: "  " }, { name: "a".repeat(101) }, [], null]) {
    await admin.addGuest(body);

    admin.thenStatus(400);
    admin.thenCockpitWasNotAccessed();
    admin.thenPrivateResponse();
  }
});

test("malformed JSON guest bodies are rejected", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  await admin.sendMalformedGuestBody("{");

  admin.thenStatus(400);
  admin.thenCockpitWasNotAccessed();
});

test("creation ignores supplied IDs/statuses and saves trimmed names with safe defaults", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  await admin.addGuest({ name: "  New Guest  ", groups: [], hosts: [], _id: "existing-guest", accepted: true, invited: true, checked_in: true, companion: true, points: 999, video: true });

  admin.thenStatus(201);
  admin.thenPrivateResponse();
  admin.thenGuestWasCreated();
  await admin.thenCreationSucceeded();
});

test("Cockpit errors do not leak upstream details or report success", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();
  admin.makeCockpitFail();

  await admin.addGuest();

  admin.thenStatus(502);
  admin.thenPrivateResponse();
  await admin.thenGenericSaveError();
});

test("unconfirmed Cockpit saves do not report creation success", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();
  admin.returnUnconfirmedSave();

  await admin.addGuest();

  admin.thenStatus(502);
  await admin.thenGenericSaveError();
});
