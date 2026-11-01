import { expect, type Page } from "@playwright/test";
import { cockpitOrigin } from "./ports";
import { BirthdayAdminDriver } from "./birthday-admin-driver";
import { InvitationDriver } from "./invitation-driver";

export class SharedThemeDriver {
  private readonly errors: string[] = [];

  constructor(private readonly page: Page) {
    page.on("pageerror", error => this.errors.push(error.stack || error.message));
  }

  async thenNoBrowserErrors() {
    expect(this.errors).toEqual([]);
  }

  async reset() { await this.page.request.post(`${cockpitOrigin}/__test/reset`); }
  async openInvitation() {
    await this.page.goto("/invite?id=guest-1");
    await expect(this.page.getByRole("heading", { name: "Unser 21. Geburtstag", exact: true })).toBeVisible();
  }
  async thenReichshofPhotoIsPreserved() { await new InvitationDriver(this.page).thenBirthdayImageIsVisible(); }
  async openProgramme() {
    await this.page.goto("/timeline");
    await expect(this.page.getByRole("heading", { name: "Programm", exact: true })).toBeVisible();
  }
  async openOrder() {
    await this.page.goto("/order");
    await expect(this.page.getByText("Bestelle deine Getränke")).toBeVisible();
  }
  async openLogin() { await new BirthdayAdminDriver(this.page).openLogin(); }
  async signIn() { await new BirthdayAdminDriver(this.page).loginWithKeyboard(); }
  async openAdminPage(page: "guests" | "scanner" | "points" | "orders") {
    await this.page.goto(`/admin/${page}`);
    const headings = { guests: "Gäste", scanner: "Ticket-Scanner", points: "Punktestand", orders: "Orders" };
    await expect(this.page.getByRole("heading", { name: headings[page], exact: true })).toBeVisible();
  }
  async thenSharedStyleIsVisible() {
    const colors = await this.page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const surface = document.elementFromPoint(1, innerHeight - 1);
      let element: Element | null = surface;
      while (element && getComputedStyle(element).backgroundColor === "rgba(0, 0, 0, 0)") element = element.parentElement;
      return { accent: body.getPropertyValue("--site-accent").trim(), background: element ? getComputedStyle(element).backgroundColor : "" };
    });
    expect(colors.accent).toBe("#e6d4b7");
    expect(colors.background).toBe("rgb(26, 25, 25)");
  }
  async thenSemanticStatusesRemainDistinct() {
    await this.page.request.post(`${cockpitOrigin}/__test/guests`, { data: [
      { _id: "a", name: "Angenommen", groups: [], hosts: [], video: false, accepted: true },
      { _id: "b", name: "Abgesagt", groups: [], hosts: [], video: false, accepted: false },
      { _id: "c", name: "Offen", groups: [], hosts: [], video: false, accepted: null },
    ] });
    await this.openAdminPage("guests");
    await expect(this.page.locator('[data-status="accepted"]')).toHaveCSS("background-color", "rgb(22, 163, 74)");
    await expect(this.page.locator('[data-status="declined"]')).toHaveCSS("background-color", "rgb(240, 128, 128)");
    await expect(this.page.locator('[data-status="unanswered"]')).toHaveCSS("background-color", "rgb(100, 112, 132)");
  }
}
