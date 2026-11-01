import { test } from "@playwright/test";
import { SharedThemeDriver } from "./support/shared-theme-driver";

let site: SharedThemeDriver;

test.beforeEach(async ({ page }) => {
  site = new SharedThemeDriver(page);
  await site.reset();
});

test("guest-facing pages share the charcoal and champagne style", async () => {
  await site.openInvitation();
  await site.thenSharedStyleIsVisible();
  await site.thenReichshofPhotoIsPreserved();

  await site.openProgramme();
  await site.thenSharedStyleIsVisible();
  await site.openOrder();
  await site.thenSharedStyleIsVisible();
});

test("admin pages share the style while preserving their workflows", async () => {
  await site.openLogin();
  await site.thenSharedStyleIsVisible();
  await site.signIn();

  for (const page of ["guests", "scanner", "points", "orders"] as const) {
    await site.openAdminPage(page);
    await site.thenSharedStyleIsVisible();
  }
  await site.thenSemanticStatusesRemainDistinct();
});
