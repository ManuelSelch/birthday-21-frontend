import { test } from "@playwright/test";
import { AddGuestsDriver } from "./support/add-guests-driver";

test("create a guest with multiple groups and shared hosts, persisted after reload", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.enterName("Shared Friend");
  await app.createGroup("Uni");
  await app.createGroup("Fußball");
  await app.toggleHost("Manuel");
  await app.toggleHost("David");

  await app.submit();
  await app.reloadGuests();

  await app.thenGuestAssignments("Shared Friend", ["Uni", "Fußball"], ["Manuel", "David"]);
});

test("individual assignment edits persist and invitation links stay accessible", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.editGuest("Alex Beispiel");
  await app.createGroup("Schule");
  await app.toggleHost("Marco");

  await app.saveAssignments();
  await app.reloadGuests();

  await app.thenGuestAssignments("Alex Beispiel", ["Schule"], ["Marco"]);
  await app.thenInvitationCanBeCopied("Alex Beispiel");
});

test("guest popups use champagne actions and a prominent form-aligned title on desktop and mobile", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.editGuest("Alex Beispiel");

  await app.thenPopupMatchesApprovedStyle("Alex Beispiel", "Speichern");
  await app.toggleHost("Manuel");
  await app.thenSelectedHostIsBlue("Manuel");
  await app.useMobileViewport();
  await app.thenPopupMatchesApprovedStyle("Alex Beispiel", "Speichern");
  await app.closePopup();

  await app.enterName("New Guest");

  await app.thenPopupMatchesApprovedStyle("Gast hinzufügen", "Gast hinzufügen");
});

test("group, host, RSVP and search filters combine, including unassigned", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.useMixedGuestList();

  await app.filterByGroup("Uni");
  await app.filterByHost("Manuel");
  await app.filterBy("Zugesagt");
  await app.searchFor("ANNA");

  await app.thenVisibleGuests(["Anna Weber"]);

  await app.searchFor("");
  await app.filterBy("Alle");
  await app.filterByGroup("—");
  await app.filterByHost("—");

  await app.thenVisibleGuests(["Alex Beispiel", "Laura Fischer"]);
});

test("missing or malformed Cockpit arrays show actionable record IDs instead of crashing dropdowns", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();

  for (const [groups, hosts] of [[undefined, undefined], [null, []], [{}, []], ["[]", []], [[null], []], [[], null]]) {
    await app.useInvalidGuestAssignments(groups, hosts);

    await app.thenGuestDataErrorIsVisible();
  }
});

test("failed assignment saves preserve selections and allow retry on mobile", async ({ page }) => {
  const app = new AddGuestsDriver(page);
  await app.open();
  await app.useMobileViewport();
  await app.editGuest("Alex Beispiel");
  await app.createGroup("Uni");
  await app.toggleHost("David");
  await app.failNextAssignmentSave();

  await app.saveAssignments();

  await app.thenAssignmentSaveFailed();
  await app.saveAssignments();
  await app.reloadGuests();
  await app.thenGuestAssignments("Alex Beispiel", ["Uni"], ["David"]);
});
