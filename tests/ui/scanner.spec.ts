import { test } from "@playwright/test";
import { ScannerDriver } from "./support/scanner-driver";

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
});

test("scanner shows the live camera when permission is available", async ({ page }) => {
  const scanner = new ScannerDriver(page);

  await scanner.open("available");

  await scanner.thenCameraIsReady();
});
