import { expect, type Page } from "@playwright/test";
import { appPort, cockpitOrigin } from "./ports";

export class BirthdayAdminDriver {
  constructor(private readonly page: Page) {}

  async resetParty() {
    const response = await this.page.request.post(`${cockpitOrigin}/__test/reset`);
    expect(response.ok()).toBe(true);
  }
  async thenAllAdminPagesRequireLogin() {
    const origin = `http://localhost:${appPort}`;
    for (const path of ["/admin", "/admin/guests", "/admin/orders", "/admin/points", "/admin/scanner"]) {
      const response = await this.page.request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(307);
      const destination = new URL(response.headers().location);
      expect(destination.origin).toBe(origin);
      expect(destination.pathname).toBe("/admin/login");
      expect(destination.searchParams.get("returnTo")).toBe(path);
    }
  }
  async openGuests() { await this.page.goto("/admin/guests"); }
  async openLogin() { await this.page.goto("/admin/login"); }
  async openPoints() { await this.page.goto("/admin/points"); }
  async openLoginWithUnsafeDestination() { await this.page.goto("/admin/login?returnTo=https://evil.test"); }
  async openGuestInvitation() { await this.page.goto("/invite?id=guest-1"); }
  async useMobileViewport() { await this.page.setViewportSize({ width: 375, height: 812 }); }
  async loginWithKeyboard(password = "birthday test password") {
    await this.page.getByLabel(/Admin-Passwort/).fill(password);
    const response = this.page.waitForResponse(response => response.url().endsWith("/api/admin/login") && response.request().method() === "POST");
    await this.page.getByLabel(/Admin-Passwort/).press("Enter");
    if ((await response).ok()) await this.page.waitForURL(url => url.pathname !== "/admin/login");
  }
  async logout() { await this.page.getByRole("button", { name: "Abmelden", exact: true }).click(); }
  async thenLoginIsVisible() {
    await expect(this.page).toHaveURL(/\/admin\/login/);
    await expect(this.page.getByRole("heading", { name: "Admin-Anmeldung" })).toBeVisible();
  }
  async thenGuestsAreVisible() {
    await expect(this.page).toHaveURL(/\/admin\/guests$/);
    await expect(this.page.getByRole("heading", { name: "Gästeliste" })).toBeVisible();
    await expect(this.page.getByRole("cell", { name: "Alex Beispiel" })).toBeVisible();
  }
  async thenNoCockpitAccess() {
    const response = await this.page.request.get(`${cockpitOrigin}/__test/state`);
    expect((await response.json()).requests).toBe(0);
  }
  async thenGuestApiIsUnauthorized() {
    const response = await this.page.request.get("/api/guests");
    expect(response.status()).toBe(401);
  }
  async thenLoginFailed() {
    await expect(this.page.getByRole("alert").filter({ hasText: "Anmeldung fehlgeschlagen" })).toContainText("Anmeldung fehlgeschlagen");
    await expect(this.page).toHaveURL(/\/admin\/login/);
  }
  async thenLoginFitsViewport() {
    await expect(this.page.getByRole("button", { name: "Anmelden", exact: true })).toBeInViewport();
    expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  async savePoints(points: number) {
    await this.page.getByPlaceholder("new").fill(String(points));
    await this.page.getByRole("button", { name: "Save", exact: true }).click();
  }
  async thenPointsAreSaved(points: number) {
    await expect.poll(async () => {
      const response = await this.page.request.get(`${cockpitOrigin}/__test/state`);
      return (await response.json()).guest.points;
    }).toBe(points);
  }
  async thenInvitationIsVisible() {
    await expect(this.page.getByRole("heading", { name: "Alex Beispiel, bist du dabei?" })).toBeVisible();
  }
  async acceptInvitation() { await this.page.getByRole("button", { name: "Ich bin dabei", exact: true }).click(); }
  async thenInvitationIsAccepted() { await expect(this.page.getByRole("heading", { name: "Du bist dabei, Alex Beispiel." })).toBeVisible(); }
}
