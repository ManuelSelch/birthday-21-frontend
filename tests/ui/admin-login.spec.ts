import { test } from "@playwright/test";
import { BirthdayAdminDriver } from "./support/birthday-admin-driver";

test("admin pages redirect before fetching guest data", async ({ page }) => {
  const app = new BirthdayAdminDriver(page);
  await app.resetParty();
  await app.openGuests();
  await app.thenLoginIsVisible();
  await app.thenNoCockpitAccess();
});

test("keyboard login returns to guests and logout blocks access", async ({ page }) => {
  const app = new BirthdayAdminDriver(page);
  await app.openGuests();
  await app.loginWithKeyboard();
  await app.thenGuestsAreVisible();
  await app.logout();
  await app.thenLoginIsVisible();
  await app.thenGuestApiIsUnauthorized();
});

test("invalid login displays a generic error without granting access", async ({ page }) => {
  const app = new BirthdayAdminDriver(page);
  await app.openLogin();
  await app.loginWithKeyboard("wrong password");
  await app.thenLoginFailed();
  await app.thenGuestApiIsUnauthorized();
});

test("login fits a narrow screen and ignores unsafe return destinations", async ({ page }) => {
  const app = new BirthdayAdminDriver(page);
  await app.useMobileViewport();
  await app.openLoginWithUnsafeDestination();
  await app.thenLoginFitsViewport();
  await app.loginWithKeyboard();
  await app.thenGuestsAreVisible();
});

test("points uses the authenticated POST endpoint", async ({ page }) => {
  const app = new BirthdayAdminDriver(page);
  await app.resetParty();
  await app.openLogin();
  await app.loginWithKeyboard();
  await app.openPoints();
  await app.savePoints(42);
  await app.thenPointsAreSaved(42);
});

test("guest invitation and acceptance stay public", async ({ page }) => {
  const app = new BirthdayAdminDriver(page);
  await app.resetParty();
  await app.openGuestInvitation();
  await app.thenInvitationIsVisible();
  await app.acceptInvitation();
  await app.thenInvitationIsAccepted();
});
