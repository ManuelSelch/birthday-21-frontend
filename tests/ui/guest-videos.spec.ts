import { test } from "@playwright/test";
import { GuestVideosDriver } from "./support/guest-videos-driver";

test("video view controls have readable text in either inherited color scheme", async ({ page }) => {
  const app = new GuestVideosDriver(page);
  await app.open();

  await app.thenControlsHaveReadableText();
});

test("mobile video switches save in both directions and persist on reload", async ({ page }) => {
  const app = new GuestVideosDriver(page);
  await app.open();

  await app.thenMinimalMobileView();
  await app.thenVideo("Anna Weber", false);
  await app.toggleVideo("Anna Weber");

  await app.thenSavedVideo("Anna Weber", true);
  await app.thenFilterCounts(3, 1);
  await app.reload();
  await app.thenVideo("Anna Weber", true);

  await app.toggleVideoWithKeyboard("Anna Weber");

  await app.thenSavedVideo("Anna Weber", false);
  await app.reload();
  await app.thenVideo("Anna Weber", false);
});

test("video filters and name/group/host search are independent of overview filters", async ({ page }) => {
  const app = new GuestVideosDriver(page);
  await app.open();
  await app.toggleVideo("Anna Weber");
  await app.thenSavedVideo("Anna Weber", true);

  await app.filter("Fehlt · 3");
  await app.thenVideoCount(3);
  await app.filter("Vorhanden · 1");
  await app.thenVideoCount(1);
  await app.search("MARCO");
  await app.thenVideo("Anna Weber", true);
  await app.search("uni");
  await app.thenVideoCount(1);
  await app.search("nobody");
  await app.thenVideoCount(0);
  await app.search("");
  await app.showOverview();
  await app.thenOverviewIsIntact();
});

test("failed video saves keep the flag and can be retried", async ({ page }) => {
  const app = new GuestVideosDriver(page);
  await app.open();
  await app.failNextSave();

  await app.toggleVideo("Anna Weber");

  await app.thenSaveFailed();
  await app.thenVideo("Anna Weber", false);
  await app.thenFilterCounts(4, 0);

  await app.toggleVideo("Anna Weber");

  await app.thenSavedVideo("Anna Weber", true);
});

test("pending saves disable switches and matching rows leave the missing filter after save", async ({ page }) => {
  const app = new GuestVideosDriver(page);
  await app.open();
  await app.filter("Fehlt · 4");
  const release = await app.holdSave();

  try {
    await app.toggleVideo("Anna Weber");
    await app.thenSaving();
  } finally {
    release();
  }

  await app.thenFilterCounts(3, 1);
  await app.thenVideoCount(3);
});
