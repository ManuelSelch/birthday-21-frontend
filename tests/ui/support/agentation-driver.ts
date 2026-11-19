import { expect, type Page } from "@playwright/test";
import { AddGuestsDriver } from "./add-guests-driver";

export class AgentationDriver {
  constructor(private readonly page: Page) {}
  async openGuestsAsAdmin() { await new AddGuestsDriver(this.page).open(); }
  async toggle() { await this.page.getByRole("button", { name: "Agentation", exact: true }).click(); }
  async shouldBeDisabled() {
    await expect(this.page.getByRole("button", { name: "Agentation", exact: true })).toHaveAttribute("aria-pressed", "false");
    await expect(this.page.locator("[data-agentation-root]")).toHaveCount(0);
  }
  async shouldBeEnabled() {
    await expect(this.page.locator("[data-agentation-root]")).toHaveCount(1);
  }
  async reload() { await this.page.reload(); }
  async openInvitation() { await this.page.goto("/invite?id=guest-1"); }
  async logoutAndOpenInvitation() {
    await this.page.goto("/admin/guests");
    await this.page.getByRole("button", { name: "Abmelden", exact: true }).click();
    await this.page.waitForURL(/\/admin\/login/);
    await this.openInvitation();
  }
  async shouldBeHidden() { await expect(this.page.locator("[data-agentation-root]")).toHaveCount(0); }
}
