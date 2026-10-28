import { expect, test, type Page, type Route } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QRCodeSVG } from "qrcode.react";
import { cockpitOrigin } from "./ports";

export class InvitationDriver {
  private views = 0;
  private release?: () => Promise<void>;

  constructor(private readonly page: Page) {
    page.on("request", request => {
      if (new URL(request.url()).pathname === "/api/invited") this.views += 1;
    });
  }

  async reset() {
    await this.page.request.post(`${cockpitOrigin}/__test/reset`);
  }
  async open() { await this.page.goto("/invite?id=guest-1"); }
  async reload() { await this.page.reload(); }
  async useViewport(width: number) { await this.page.setViewportSize({ width, height: 900 }); }
  async accept() { await this.page.getByRole("button", { name: "Ich bin dabei", exact: true }).click(); }
  async acceptWithKeyboard() {
    await this.page.getByRole("button", { name: "Ich bin dabei", exact: true }).focus();
    await this.page.keyboard.press("Enter");
  }
  async cancel() { await this.page.getByRole("button", { name: "Teilnahme absagen" }).click(); }
  async bringCompanion() { await this.page.getByText("Ich bringe eine Begleitung mit", { exact: true }).click(); }
  async thenPending() {
    await expect(this.page.getByRole("heading", { name: "Alex Beispiel, bist du dabei?" })).toBeVisible();
    await expect(this.page.getByRole("button", { name: "Ich bin dabei", exact: true })).toBeEnabled();
    await expect(this.page.getByRole("link", { name: "Apple Wallet" })).toHaveCount(0);
  }
  async thenAccepted() {
    await expect(this.page.getByRole("heading", { name: "Du bist dabei, Alex Beispiel." })).toBeVisible();
    await expect(this.page.getByRole("button", { name: "Teilnahme absagen" })).toBeEnabled();
  }
  async thenCompanionSaved() {
    await expect(this.page.getByRole("switch")).toBeChecked();
    await expect.poll(async () => {
      const response = await this.page.request.get(`${cockpitOrigin}/__test/state`);
      return (await response.json()).guest.companion;
    }).toBe(true);
  }
  async thenCompanionUnchanged() { await expect(this.page.getByRole("switch")).not.toBeChecked(); }
  async thenTrackedOnce() {
    await expect.poll(() => this.views).toBe(1);
  }
  async thenTicketHasGuestLinks() {
    const invitation = "https://geburtstag.manuelselch.de/invite?id=guest-1";
    await expect(this.page.getByRole("link", { name: "Apple Wallet" })).toHaveAttribute("href", "https://geburtstag.manuelselch.de/api/apple-pass?id=guest-1");
    await expect(this.page.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", "https://chat.whatsapp.com/KlJOiGqBwcEDC4R4pTK0vN?mode=wwt");
    const reference = renderToStaticMarkup(createElement(QRCodeSVG, { value: invitation, size: 200, marginSize: 4, level: "M" }));
    const path = reference.match(/<path fill="#000000" d="([^"]+)"/)?.[1];
    expect(path).toBeTruthy();
    const qr = this.page.getByRole("img", { name: "Eintrittsticket für Alex Beispiel" });
    await expect(qr).toHaveAttribute("width", "200");
    await expect(qr.locator('path[fill="#000000"]')).toHaveAttribute("d", path!);
  }
  async thenLayoutFits() {
    expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(this.page.getByRole("heading", { name: "21. Geburtstag", exact: true })).toBeVisible();
  }
  async thenMobileTextIsReadable() {
    const size = await this.page.getByText("Location folgt · Bayreuth", { exact: true }).evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    expect(size).toBeGreaterThanOrEqual(16);
    const hosts = await this.page.getByText("MANUEL · MARCO · DAVID", { exact: true }).evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    expect(hosts).toBeGreaterThanOrEqual(16);
  }
  async captureLayout() {
    await this.page.screenshot({ path: test.info().outputPath("invitation.png"), fullPage: true });
  }
  async thenActionsAreAdjacent() {
    const wallet = await this.page.getByRole("link", { name: "Apple Wallet" }).boundingBox();
    const whatsapp = await this.page.getByRole("link", { name: "WhatsApp" }).boundingBox();
    expect(wallet).not.toBeNull();
    expect(whatsapp).not.toBeNull();
    expect(Math.abs(wallet!.y - whatsapp!.y)).toBeLessThan(2);
    expect(wallet!.x + wallet!.width).toBeLessThanOrEqual(whatsapp!.x);
    expect(wallet!.height).toBeGreaterThanOrEqual(44);
    expect(whatsapp!.height).toBeGreaterThanOrEqual(44);
    await this.thenLayoutFits();
  }
  async failAction(action: "accept" | "cancel" | "companion", mode: "http" | "result" = "http") {
    await this.page.route(`**/api/${action}?*`, route => route.fulfill({ status: mode === "http" ? 500 : 200, json: { success: false } }));
  }
  async restoreActions() { await this.page.unrouteAll({ behavior: "wait" }); }
  async thenErrorIsVisible() { await expect(this.page.getByRole("alert", { name: "Das hat nicht geklappt" })).toContainText("Bitte versuche es erneut."); }
  async holdAcceptance() {
    await this.page.route("**/api/accept?*", (route: Route) => {
      return new Promise<void>(resolve => {
        this.release = async () => { await route.continue(); resolve(); };
      });
    });
  }
  async thenSaving() {
    await expect(this.page.getByRole("button", { name: "Ich bin dabei", exact: true })).toBeDisabled();
    await expect(this.page.getByRole("heading", { name: "Alex Beispiel, bist du dabei?" })).toBeVisible();
  }
  async finishAcceptance() {
    await expect.poll(() => !!this.release).toBe(true);
    await this.release!();
  }
  async openWithoutId() { await this.page.goto("/invite"); }
  async openUnknownGuest() { await this.page.goto("/invite?id=unknown"); }
  async openRepeatedId() { await this.page.goto("/invite?id=guest-1&id=other"); }
  async thenAccessDenied() {
    await expect(this.page.getByRole("heading", { name: "Einladung nicht verfügbar" })).toBeVisible();
    await expect(this.page.getByRole("button", { name: "Ich bin dabei" })).toHaveCount(0);
  }
  async thenNoGuestRequest() {
    const response = await this.page.request.get(`${cockpitOrigin}/__test/state`);
    expect((await response.json()).requests).toBe(0);
  }
}
