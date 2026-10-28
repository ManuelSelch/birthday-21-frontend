import { expect, type Page } from "@playwright/test";
import { BirthdayAdminDriver } from "./birthday-admin-driver";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QRCodeSVG } from "qrcode.react";
import { resolve } from "node:path";

export class ScannerDriver {
  private readonly errors: string[] = [];
  private checkInRequests = 0;

  constructor(private readonly page: Page) {
    page.on("pageerror", error => this.errors.push(error.message));
  }

  async open(camera: "available" | "denied" = "denied") {
    await this.page.route("**/zxing_reader.wasm", route => route.fulfill({
      path: resolve("node_modules/zxing-wasm/dist/reader/zxing_reader.wasm"),
      contentType: "application/wasm",
    }));
    await this.page.addInitScript(({ available }) => {
      Object.defineProperty(navigator.mediaDevices, "getUserMedia", {
        configurable: true,
        writable: true,
        value: async () => {
          if (!available) throw new DOMException("Permission denied", "NotAllowedError");
          const canvas = document.createElement("canvas");
          (window as unknown as { scannerCanvas: HTMLCanvasElement }).scannerCanvas = canvas;
          canvas.width = 640;
          canvas.height = 640;
          const context = canvas.getContext("2d")!;
          context.fillStyle = "#080d16";
          context.fillRect(0, 0, 640, 640);
          const stream = canvas.captureStream(10);
          const track = stream.getVideoTracks()[0];
          const redraw = window.setInterval(() => {
            if (track.readyState === "ended") window.clearInterval(redraw);
            else context.drawImage(canvas, 0, 0);
          }, 100);
          return stream;
        },
      });
    }, { available: camera === "available" });
    const admin = new BirthdayAdminDriver(this.page);
    await admin.resetParty();
    await admin.openLogin();
    await admin.loginWithKeyboard();
    await this.page.getByRole("link", { name: "Scanner", exact: true }).click();
    await expect(this.page.getByRole("heading", { name: "Ticket-Scanner" })).toBeVisible();
    await expect(this.page.getByRole("button", { name: "Abmelden", exact: true })).toHaveCount(0);
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
    await this.page.locator("video").scrollIntoViewIfNeeded();
    await expect(this.page.locator("video")).toBeVisible();
    await expect.poll(() => this.page.locator("video").evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThan(1);
    await expect(this.page.getByRole("status")).toHaveText("Bereit zum Scannen");
    await expect(this.page.getByText("Kamera nicht verfügbar", { exact: true })).toHaveCount(0);
    expect(this.errors).toEqual([]);
  }

  async useCheckInResponse(response: { success: boolean; warning?: string; error?: string }) {
    await this.page.route("**/api/check-in", route => {
      this.checkInRequests += 1;
      return route.fulfill({ json: response });
    });
  }

  async presentTicket(value = "https://example.test/?id=guest-1") {
    await expect.poll(() => this.page.evaluate(() => Boolean((window as unknown as { scannerCanvas?: HTMLCanvasElement }).scannerCanvas))).toBe(true);
    const svg = renderToStaticMarkup(createElement(QRCodeSVG, { value, size: 640, marginSize: 4, xmlns: "http://www.w3.org/2000/svg" }));
    await this.page.evaluate(async source => {
      const image = new Image();
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
      await image.decode();
      const canvas = (window as unknown as { scannerCanvas: HTMLCanvasElement }).scannerCanvas;
      canvas.getContext("2d")!.drawImage(image, 0, 0, 640, 640);
    }, svg);
  }

  async thenScanIsPaused(title: string, requests = 1) {
    await expect(this.page.getByText(title, { exact: true })).toBeVisible();
    await expect(this.page.getByText("Scanner pausiert", { exact: true })).toBeVisible();
    const nextGuest = this.page.getByRole("button", { name: "Nächsten Gast scannen" });
    await nextGuest.scrollIntoViewIfNeeded();
    await expect(nextGuest).toBeInViewport();
    expect(this.checkInRequests).toBe(requests);
  }

  async thenRepeatedFramesAreIgnored() {
    // A visible paused placeholder and no active camera means repeated frames cannot be read.
    await expect(this.page.locator("video")).toHaveCount(0);
    expect(this.checkInRequests).toBe(1);
  }

  async scanNextGuest() {
    await this.page.evaluate(() => { delete (window as unknown as { scannerCanvas?: HTMLCanvasElement }).scannerCanvas; });
    await this.page.getByRole("button", { name: "Nächsten Gast scannen" }).click();
    await this.thenCameraIsReady();
    await expect(this.page.getByText("Check-in erfolgreich.", { exact: true })).toHaveCount(0);
    await expect(this.page.getByRole("button", { name: "Nächsten Gast scannen" })).toHaveCount(0);
  }

  async returnToGuests() {
    await this.page.getByRole("link", { name: "Gästeliste", exact: true }).click();
    await new BirthdayAdminDriver(this.page).thenGuestsAreVisible();
  }
}
