import { test } from "@playwright/test";
import { BirthdayAdminDriver } from "./support/birthday-admin-driver";

test("admin and superstar pages redirect before any Cockpit data access", async ({ page }) => {
  const app = new BirthdayAdminDriver(page);
  await app.resetParty();

  await app.thenAllAdminPagesRequireLogin();

  await app.thenNoCockpitAccess();
  await app.thenGuestApiIsUnauthorized();
});

test("login returns a screen to its requested superstar page", async ({ page }) => {
  const app = new BirthdayAdminDriver(page);
  await app.openSuperstarProjector();
  await app.thenLoginIsVisible();

  await app.loginWithKeyboard();
  await app.thenSuperstarProjectorIsVisible();
});

test("the guests page links to the superstar controller", async ({ page }) => {
  const app = new BirthdayAdminDriver(page);
  await app.resetParty();
  await app.openLogin();
  await app.loginWithKeyboard();

  await app.openSuperstarControl();
  await app.thenSuperstarControlIsVisible();
});
