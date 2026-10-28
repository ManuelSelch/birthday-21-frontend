import { test } from "@playwright/test";
import { InvitationDriver } from "./support/invitation-driver";

test("WhatsApp receives the approved public preview without changing guest attendance", async ({ page }) => {
  const invite = new InvitationDriver(page);
  await invite.reset();

  await invite.thenSharePreviewIsPublic();
});

test("personal invitation records viewing once and persists RSVP, companion and cancellation", async ({ page }) => {
  const invite = new InvitationDriver(page);
  await invite.reset();
  await invite.open();
  await invite.thenPending();

  await invite.acceptWithKeyboard();
  await invite.thenAccepted();
  await invite.thenTicketHasGuestLinks();
  await invite.bringCompanion();
  await invite.thenCompanionSaved();
  await invite.thenTrackedOnce();

  await invite.reload();
  await invite.thenAccepted();
  await invite.thenCompanionSaved();
  await invite.cancel();
  await invite.thenPending();
  await invite.reload();
  await invite.thenPending();
});

test("accepted invitation shows concise evening details before the ticket", async ({ page }) => {
  const invite = new InvitationDriver(page);
  await invite.reset();
  await invite.open();
  await invite.accept();

  await invite.thenEveningDetailsAreVisible();
  await invite.thenTicketHasGuestLinks();
});

test("invitation introduces all three hosts with labelled portraits", async ({ page }) => {
  const invite = new InvitationDriver(page);
  await invite.reset();
  await invite.open();

  await invite.thenHostPortraitsAreVisible();
});

for (const width of [320, 375, 640, 641, 768, 1280]) {
  test(`invitation fits ${width}px with stacked evening details`, async ({ page }) => {
    const invite = new InvitationDriver(page);
    await invite.reset();
    await invite.useViewport(width);
    await invite.open();
    await invite.thenLayoutFits();
    await invite.thenDateAndLocationAreStacked();
    await invite.thenHostPortraitsAreVisible();
    if (width < 640) {
      await invite.thenMobileTextIsReadable();
    }

    await invite.accept();

    await invite.thenAccepted();
    await invite.thenCompanionChoiceFits();
    await invite.thenEveningDetailsAreVisible();
    await invite.thenEveningDetailsAndTicketAreStacked();
    await invite.thenLayoutFits();
    await invite.thenTicketHasGuestLinks();
    await invite.captureLayout();
  });
}

test("failed mutations retain saved state and can be retried", async ({ page }) => {
  const invite = new InvitationDriver(page);
  await invite.reset();
  await invite.open();
  await invite.failAction("accept", "result");

  await invite.accept();

  await invite.thenErrorIsVisible();
  await invite.thenPending();
  await invite.restoreActions();
  await invite.accept();
  await invite.thenAccepted();
  await invite.failAction("companion");
  await invite.bringCompanion();
  await invite.thenErrorIsVisible();
  await invite.thenCompanionUnchanged();
  await invite.failAction("cancel");
  await invite.cancel();
  await invite.thenErrorIsVisible();
  await invite.thenAccepted();
});

test("companion row supports keyboard toggle, green saved state and removal", async ({ page }) => {
  const invite = new InvitationDriver(page);
  await invite.reset();
  await invite.open();
  await invite.accept();
  await invite.thenAccepted();
  await invite.thenCompanionChoiceFits();
  await invite.holdCompanionSave();

  await invite.toggleCompanionWithKeyboard();

  await invite.thenCompanionSaving();
  await invite.finishCompanionSave();
  await invite.thenCompanionSaved();
  await invite.restoreActions();
  await invite.reload();
  await invite.thenCompanionSaved();

  await invite.toggleCompanionWithKeyboard();

  await invite.thenCompanionRemoved();
  await invite.reload();
  await invite.thenCompanionRemoved();
});

test("attendance stays pending while a save is in progress", async ({ page }) => {
  const invite = new InvitationDriver(page);
  await invite.reset();
  await invite.open();
  await invite.holdAcceptance();

  await invite.accept();

  await invite.thenSaving();
  await invite.finishAcceptance();
  await invite.thenAccepted();
});

test("missing, repeated and unknown guest IDs do not expose an invitation", async ({ page }) => {
  const invite = new InvitationDriver(page);
  await invite.reset();

  await invite.openWithoutId();
  await invite.thenAccessDenied();
  await invite.thenNoGuestRequest();
  await invite.openRepeatedId();
  await invite.thenAccessDenied();
  await invite.thenNoGuestRequest();
  await invite.openUnknownGuest();
  await invite.thenAccessDenied();
});
