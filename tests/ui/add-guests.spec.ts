import { test } from "@playwright/test";
import { AddGuestsDriver } from "./support/add-guests-driver";

test("add a guest by name and refresh the list, counters and search", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.searchFor("No matching guest");
  await app.enterName("  New Guest  ");

  await app.submit();

  await app.thenGuestAppears("New Guest", 2);
});

test("blank names are rejected without creating a guest", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.enterName("   ");

  await app.submit();

  await app.thenValidationIsVisible();
});

test("failed saves preserve the name and allow retry", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.enterName("New Guest");
  await app.failNextSave();

  await app.submit();

  await app.thenSaveFailedWithName("New Guest");
  await app.submit();
  await app.thenGuestAppears("New Guest", 2);
});

test("pending creation disables submission on mobile", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.useMobileViewport();
  await app.thenFormFitsViewport();
  await app.enterName("New Guest");
  const release = await app.holdSave();

  try {
    await app.submit();
    await app.thenSubmissionIsDisabled();
  } finally {
    release();
  }

  await app.thenGuestAppears("New Guest", 2);
});
