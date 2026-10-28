import { expect, type Page } from "@playwright/test";
import { BirthdayAdminDriver } from "./birthday-admin-driver";

export class ScannerDriver {
  private readonly errors: string[] = [];

  constructor(private readonly page: Page) {
    page.on("pageerror", error => this.errors.push(error.message));
  }

  async open(camera: "available" | "denied" = "denied") {
    await this.page.addInitScript(({ available }) => {
      Object.defineProperty(navigator.mediaDevices, "getUserMedia", {
        configurable: true,
        writable: true,
        value: async () => {
          if (!available) throw new DOMException("Permission denied", "NotAllowedError");
          const canvas = document.createElement("canvas");
          canvas.width = 640;
          canvas.height = 640;
          const context = canvas.getContext("2d")!;
          context.fillStyle = "#080d16";
          context.fillRect(0, 0, 640, 640);
          return canvas.captureStream(10);
        },
      });
    }, { available: camera === "available" });
    const admin = new BirthdayAdminDriver(this.page);
    await admin.resetParty();
    await admin.openLogin();
    await admin.loginWithKeyboard();
    await this.page.getByRole("link", { name: "Scanner", exact: true }).click();
    await expect(this.page.getByRole("heading", { name: "Ticket-Scanner" })).toBeVisible();
  }

  async useMobileViewport() { await this.page.setViewportSize({ width: 375, height: 812 }); }

  async thenApprovedDesignIsVisible() {
    const main = this.page.getByRole("main");
    await expect(main.locator("..")).toHaveCSS("background-color", "rgb(13, 18, 32)");
    await expect(main.getByRole("heading")).toHaveCSS("font-family", /Georgia/);
    await expect(this.page.getByText("21. Geburtstag", { exact: true })).toBeVisible();
    await expect(this.page.getByText("WILLKOMMEN AM EINGANG")).toHaveCount(0);
    await expect(this.page.getByText("Halte den QR-Code der Einladung vor die Kamera.")).toHaveCount(0);
    await expect(this.page.getByRole("region", { name: "Ticket scannen" })).toBeVisible();
    await expect(this.page.getByRole("link", { name: "Gästeliste", exact: true })).toBeInViewport();
    expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }

  async thenCameraFailureIsVisible() {
    await expect(this.page.getByText("Kamera nicht verfügbar", { exact: true })).toBeVisible();
    await expect(this.page.getByRole("status")).toHaveText("Bitte Kamerazugriff im Browser erlauben.");
    // The scanner library also rejects its cleanup queue after denied getUserMedia.
    // Assert the usable error UI above, while still rejecting unrelated browser errors.
    expect(this.errors.every(message => message === "Permission denied")).toBe(true);
  }

  async thenCameraIsReady() {
    await expect(this.page.locator("video")).toBeVisible();
    await expect(this.page.getByRole("status")).toHaveText("Bereit zum Scannen");
    await expect(this.page.getByText("Kamera nicht verfügbar", { exact: true })).toHaveCount(0);
    expect(this.errors).toEqual([]);
  }

  async returnToGuests() {
    await this.page.getByRole("link", { name: "Gästeliste", exact: true }).click();
    await new BirthdayAdminDriver(this.page).thenGuestsAreVisible();
  }
}
