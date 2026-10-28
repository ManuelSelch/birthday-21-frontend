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
  async useViewport(width: number) { await this.page.setViewportSize({ width, height: width < 640 ? 812 : 900 }); }
  async accept() { await this.page.getByRole("button", { name: "Ich bin dabei", exact: true }).click(); }
  async acceptWithKeyboard() {
    await this.page.getByRole("button", { name: "Ich bin dabei", exact: true }).focus();
    await this.page.keyboard.press("Enter");
  }
  async cancel() { await this.page.getByRole("button", { name: "Teilnahme absagen" }).click(); }
  private companionChoice() { return this.page.getByRole("button", { name: "Ich bringe eine Begleitung mit", exact: true }); }
  async bringCompanion() { await this.companionChoice().click(); }
  async toggleCompanionWithKeyboard() {
    await this.companionChoice().focus();
    await this.page.keyboard.press("Space");
  }
  async thenCompanionChoiceFits() {
    const choice = this.companionChoice();
    await expect(choice).toHaveAttribute("aria-pressed", "false");
    await expect(choice).toContainText("Nur wenn deine Begleitung keine eigene Einladung hat.");
    const box = await choice.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(88);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(this.page.viewportSize()!.width);
    await expect(choice.locator("svg")).toHaveAttribute("width", "32");
    await expect(choice.locator("svg")).toHaveClass(/icon-arrow-right/);
  }
  async holdCompanionSave() {
    await this.page.route("**/api/companion?*", (route: Route) => {
      return new Promise<void>(resolve => {
        this.release = async () => { await route.continue(); resolve(); };
      });
    });
  }
  async thenCompanionSaving() {
    await expect(this.companionChoice()).toBeDisabled();
    await expect(this.companionChoice()).toHaveAttribute("aria-pressed", "false");
    const cancel = this.page.getByRole("button", { name: "Teilnahme absagen" });
    await expect(cancel).toBeDisabled();
    await expect(cancel).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  }
  async finishCompanionSave() {
    await expect.poll(() => !!this.release).toBe(true);
    await this.release!();
  }
  async thenCompanionRemoved() {
    await this.thenCompanionUnchanged();
    await expect.poll(async () => {
      const response = await this.page.request.get(`${cockpitOrigin}/__test/state`);
      return (await response.json()).guest.companion;
    }).toBe(false);
  }
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
    await this.page.mouse.move(0, 0);
    const choice = this.companionChoice();
    await expect(choice).toHaveAttribute("aria-pressed", "true");
    await expect(choice).toContainText("Deine Begleitung ist dabei");
    await expect(choice).toHaveCSS("background-color", "rgb(20, 45, 41)");
    await expect(choice.locator("svg")).toHaveClass(/icon-check/);
    await expect(choice.locator("svg")).toHaveCSS("color", "rgb(136, 229, 178)");
    await expect.poll(async () => {
      const response = await this.page.request.get(`${cockpitOrigin}/__test/state`);
      return (await response.json()).guest.companion;
    }).toBe(true);
  }
  async thenCompanionUnchanged() { await expect(this.companionChoice()).toHaveAttribute("aria-pressed", "false"); }
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
  async thenDateAndLocationAreStacked() {
    const date = await this.page.getByText("WANN", { exact: true }).boundingBox();
    const location = await this.page.getByText("WO", { exact: true }).boundingBox();
    expect(date).not.toBeNull();
    expect(location).not.toBeNull();
    expect(date!.y + date!.height).toBeLessThan(location!.y);
    expect(Math.abs(date!.x - location!.x)).toBeLessThan(2);
  }
  async thenMobileLayoutIsCompact() {
    await this.thenDateAndLocationAreStacked();
    expect(await this.page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)).toBeLessThanOrEqual(0);
    const layout = await this.page.getByRole("main").locator(":scope > div").boundingBox();
    expect(layout!.y + layout!.height).toBeGreaterThanOrEqual(this.page.viewportSize()!.height - 1);
  }
  async thenHeroGrowsWithScreen() {
    const hero = this.page.getByRole("main").locator("header");
    const before = await hero.boundingBox();
    const viewport = this.page.viewportSize()!;

    await this.page.setViewportSize({ width: viewport.width, height: viewport.height + 120 });

    await expect.poll(async () => (await hero.boundingBox())!.height - before!.height).toBeCloseTo(120, 0);
    await this.thenMobileLayoutIsCompact();
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
