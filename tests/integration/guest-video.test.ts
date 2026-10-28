import { test } from "node:test";
import { AdminRoutesDriver } from "./support/admin-routes-driver";

test("video updates require authentication before Cockpit access", async context => {
  const admin = await AdminRoutesDriver.create(context);

  await admin.setVideo();

  admin.thenStatus(401);
  admin.thenCockpitWasNotAccessed();
});

test("video updates save only the ID and boolean in either direction", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  for (const video of [true, false]) {
    await admin.setVideo({ id: "guest-1", video, accepted: true, groups: ["Other"], name: "Changed" });

    admin.thenStatus(200);
    admin.thenPrivateResponse();
    admin.thenVideoWasSaved(video);
  }
});

test("invalid video values and IDs are rejected before Cockpit access", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  for (const body of [null, {}, { id: "guest-1" }, { id: "../guests", video: true },
    { id: "guest-1", video: "true" }, { id: "guest-1", video: 1 }, { id: "guest-1", video: null }]) {
    await admin.setVideo(body);

    admin.thenStatus(400);
    admin.thenCockpitWasNotAccessed();
  }
});

test("video writes do not create unknown guests", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();

  await admin.setVideo({ id: "unknown", video: true });

  admin.thenStatus(404);
  admin.thenNoCockpitWrites();
});

test("video upstream failures remain private", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();
  admin.makeCockpitFail();

  await admin.setVideo();

  admin.thenStatus(502);
  admin.thenPrivateResponse();
});

test("unconfirmed video writes never report success", async context => {
  const admin = await AdminRoutesDriver.create(context);
  admin.signIn();
  admin.returnUnconfirmedSave();

  await admin.setVideo();

  admin.thenStatus(502);
});
