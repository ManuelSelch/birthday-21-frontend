import { test } from "@playwright/test";
import { AddGuestsDriver } from "./support/add-guests-driver";

test("guest list renders server-passed logout without React key warnings", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();

  await app.reloadGuests();
  await app.enterName("New Guest");
  await app.submit();

  await app.thenGuestAppears("New Guest", 2);
  await app.thenNoKeyWarnings();
});

test("guest filters distinguish accepted, unanswered and declined and combine with search", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.useMixedGuestList();
  await app.thenMixedSummaryIsVisible();

  await app.filterBy("Zusagen");

  await app.thenVisibleGuests(["Anna Weber", "Felix Schneider"]);

  await app.searchFor("ANNA");

  await app.thenVisibleGuests(["Anna Weber"]);

  await app.searchFor("");
  await app.filterBy("Offen");

  await app.thenVisibleGuests(["Laura Fischer"]);

  await app.searchFor("Nobody");

  await app.thenNoMatches();
});

test("successful guest creation resets search and selected filter", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.useMixedGuestList();
  await app.filterBy("Zusagen");
  await app.searchFor("Anna");
  await app.enterName("New Guest");

  await app.submit();

  await app.thenCreationClearsFilters();
  await app.thenTotalGuests(5);
});

test("the guest list uses the approved styling without overflowing mobile", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.useMobileViewport();

  await app.thenFormFitsViewport();
  await app.thenApprovedStyleAndMobileTableFit();
});

test("compact guest table uses invited name colors and fits narrow screens", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.useMixedGuestList();

  await app.thenCompactInvitationLinksAreVisible();
  await app.thenMixedSummaryIsVisible();
});

test("scanner is in the top bar, orders is removed and logout and invitations remain available", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();

  await app.thenNavigationIsReal();
});
