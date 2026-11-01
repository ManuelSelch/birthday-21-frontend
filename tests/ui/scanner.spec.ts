import { test } from "@playwright/test";
import { ScannerDriver } from "./support/scanner-driver";

test("scanner pauses after success until the next guest is requested", async ({ page }) => {
  const scanner = new ScannerDriver(page);
  await scanner.useMobileViewport();
  await scanner.useCheckInResponse({ success: true });
  await scanner.open("available");
  await scanner.thenCameraIsReady();

  await scanner.presentTicket();

  await scanner.thenScanIsPaused("Ticket gültig");
  await scanner.thenRepeatedFramesAreIgnored();

  await scanner.scanNextGuest();
  await scanner.presentTicket();

  await scanner.thenScanIsPaused("Ticket gültig", 2);
});

for (const outcome of [
  { response: { success: false, warning: "guest is already checked in" }, title: "Bereits eingecheckt" },
  { response: { success: false, error: "server error" }, title: "Ticket nicht gültig" },
]) {
  test(`scanner pauses after ${outcome.title}`, async ({ page }) => {
    const scanner = new ScannerDriver(page);
    await scanner.useCheckInResponse(outcome.response);
    await scanner.open("available");
    await scanner.thenCameraIsReady();

    await scanner.presentTicket();

    await scanner.thenScanIsPaused(outcome.title);
    await scanner.thenRepeatedFramesAreIgnored();

    await scanner.scanNextGuest();
  });
}

for (const ticket of ["not a ticket", "https://example.test/no-id"]) {
  test(`scanner pauses for invalid QR ${ticket}`, async ({ page }) => {
    const scanner = new ScannerDriver(page);
    await scanner.open("available");
    await scanner.thenCameraIsReady();

    await scanner.presentTicket(ticket);

    await scanner.thenScanIsPaused("Ticket nicht gültig", 0);

    await scanner.scanNextGuest();
  });
}

test("scanner matches the approved admin theme and keeps guest navigation", async ({ page }) => {
  const scanner = new ScannerDriver(page);
  await scanner.open();

  await scanner.thenApprovedDesignIsVisible();
  await scanner.thenCameraFailureIsVisible();

  await scanner.returnToGuests();
});

test("scanner fits mobile and displays camera permission failures", async ({ page }) => {
  const scanner = new ScannerDriver(page);
  await scanner.useMobileViewport();

  await scanner.open();

  await scanner.thenApprovedDesignIsVisible();
  await scanner.thenCameraFailureIsVisible();
  await scanner.leaveScannerWithoutErrors();
});

test("scanner shows the live camera when permission is available", async ({ page }) => {
  const scanner = new ScannerDriver(page);

  await scanner.open("available");

  await scanner.thenCameraIsReady();
});
