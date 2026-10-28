import { test } from "node:test";
import { AdminRoutesDriver } from "./support/admin-routes-driver";

test("assignment writes require authentication before Cockpit access", async context => {
  const admin = await AdminRoutesDriver.create(context);

  await admin.assignGuest();

  admin.thenStatus(401);
  admin.thenCockpitWasNotAccessed();
});

test("assignment updates save only groups and hosts, never caller statuses", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  await admin.assignGuest({ id: "guest-1", groups: [" Uni ", "Uni"], hosts: ["Manuel", "Marco"], accepted: false, points: 999 });

  admin.thenStatus(200);
  admin.thenPrivateResponse();
  admin.thenAssignmentsWereSaved();
});

test("invalid assignments and IDs are rejected before Cockpit", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  for (const body of [{ id: "../guests", groups: [], hosts: [] }, { groups: [], hosts: [] },
    { id: "guest-1", groups: [], hosts: ["Unknown"] }, { id: "guest-1", hosts: [] }, null]) {
    await admin.assignGuest(body);

    admin.thenStatus(400);
    admin.thenCockpitWasNotAccessed();
  }
});

test("assignment failures remain private and do not report success", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();
  admin.makeCockpitFail();

  await admin.assignGuest();

  admin.thenStatus(502);
  admin.thenPrivateResponse();
});

test("unknown guest IDs do not create guests", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  await admin.assignGuest({ id: "unknown", groups: [], hosts: [] });

  admin.thenStatus(404);
  admin.thenNoCockpitWrites();
});

test("unconfirmed assignment writes do not report success", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();
  admin.returnUnconfirmedSave();

  await admin.assignGuest();

  admin.thenStatus(502);
});

test("creation persists groups and shared hosts", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  await admin.addGuest({ name: "Alex", groups: ["Uni"], hosts: ["Manuel", "David"] });

  admin.thenStatus(201);
  admin.thenCreatedAssignments(["Uni"], ["Manuel", "David"]);
});
