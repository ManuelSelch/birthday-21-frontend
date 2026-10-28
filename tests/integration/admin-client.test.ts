import { test } from "node:test";
import { AdminClientDriver } from "./support/admin-client-driver";

test("admin client sends JSON bodies for points and check-in", async context => {
  const admin = new AdminClientDriver(context);

  await admin.changePoints();
  await admin.checkIn();

  admin.thenPostBodiesWereSent();
});
