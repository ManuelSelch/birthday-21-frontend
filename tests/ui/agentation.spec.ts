import { test } from "@playwright/test";
import { AgentationDriver } from "./support/agentation-driver";

test("admin enables annotations for the tab and can turn them off", async ({ page }) => {
  const app = new AgentationDriver(page);
  await app.openGuestsAsAdmin();
  await app.shouldBeDisabled();

  await app.toggle();
  await app.shouldBeEnabled();
  await app.reload();
  await app.shouldBeEnabled();
  await app.openInvitation();
  await app.shouldBeEnabled();

  await app.logoutAndOpenInvitation();
  await app.shouldBeHidden();
});

test("admin can disable annotations", async ({ page }) => {
  const app = new AgentationDriver(page);
  await app.openGuestsAsAdmin();
  await app.toggle();
  await app.shouldBeEnabled();
  await app.toggle();
  await app.shouldBeDisabled();
});
