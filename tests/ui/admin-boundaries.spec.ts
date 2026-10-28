import { test } from "@playwright/test";
import { BirthdayAdminDriver } from "./support/birthday-admin-driver";

test("every admin page redirects before any Cockpit data access", async ({ page }) => {
  const app = new BirthdayAdminDriver(page);
  await app.resetParty();

  await app.thenAllAdminPagesRequireLogin();

  await app.thenNoCockpitAccess();
  await app.thenGuestApiIsUnauthorized();
});
