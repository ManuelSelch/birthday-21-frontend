import { expect, type Page } from "@playwright/test";
import { BirthdayAdminDriver } from "./birthday-admin-driver";

export class AddGuestsDriver {
  constructor(private readonly page: Page) {}

  async open() {
    const admin = new BirthdayAdminDriver(this.page);
    await admin.resetParty();
    await admin.openLogin();
    await admin.loginWithKeyboard();
    await admin.thenGuestsAreVisible();
  }

  async searchFor(name: string) { await this.page.getByPlaceholder("Search guest by name...").fill(name); }
  async enterName(name: string) { await this.page.getByRole("textbox", { name: "Name", exact: true }).fill(name); }
  async submit() { await this.page.getByRole("textbox", { name: "Name", exact: true }).press("Enter"); }
  async thenGuestAppears(name: string, count: number) {
    const row = this.page.getByRole("row").filter({ has: this.page.getByRole("cell", { name, exact: true }) });
    await expect(row).toBeVisible();
    await expect(row.getByRole("cell").nth(1)).toHaveText("--");
    await expect(row.getByRole("cell").nth(2)).toHaveText("--");
    const existing = this.page.getByRole("row").filter({ has: this.page.getByRole("cell", { name: "Alex Beispiel", exact: true }) });
    await expect(existing.getByRole("cell").nth(1)).toHaveText("✖");
    await expect(existing.getByRole("cell").nth(2)).toHaveText("✖");
    await expect(row.getByRole("button", { name: "Invite", exact: true })).toBeVisible();
    await expect(this.page.getByText("Gäste: " + count, { exact: true })).toBeVisible();
    await expect(this.page.getByText("Angenommen: 0", { exact: true })).toBeVisible();
    await expect(this.page.getByPlaceholder("Search guest by name...")).toHaveValue("");
    await expect(this.page.getByRole("textbox", { name: "Name", exact: true })).toHaveValue("");
    await expect(this.page.getByRole("status")).toHaveText("Gast hinzugefügt.");
  }
  async thenValidationIsVisible() {
    await expect(this.page.getByText("Bitte gib einen Namen mit 1 bis 100 Zeichen ein.")).toBeVisible();
    await expect(this.page.getByText("Gäste: 1", { exact: true })).toBeVisible();
  }
  async failNextSave() {
    let failed = false;
    await this.page.route("**/api/guests", async route => {
      if (route.request().method() !== "POST" || failed) return route.continue();
      failed = true;
      await route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ error: "save failed" }) });
    });
  }
  async thenSaveFailedWithName(name: string) {
    await expect(this.page.getByRole("alert").filter({ hasText: "Gast konnte nicht hinzugefügt werden." })).toContainText("Gast konnte nicht hinzugefügt werden.");
    await expect(this.page.getByRole("textbox", { name: "Name", exact: true })).toHaveValue(name);
    await expect(this.page.getByRole("button", { name: "Add", exact: true })).toBeEnabled();
    await expect(this.page.getByText("Gäste: 1", { exact: true })).toBeVisible();
  }
  async holdSave() {
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await this.page.route("**/api/guests", async route => {
      if (route.request().method() !== "POST") return route.continue();
      await gate;
      await route.continue();
    });
    return release;
  }
  async thenSubmissionIsDisabled() {
    await expect(this.page.getByRole("button", { name: "Add", exact: true })).toBeDisabled();
    await expect(this.page.getByRole("textbox", { name: "Name", exact: true })).toBeDisabled();
  }
  async useMobileViewport() { await this.page.setViewportSize({ width: 375, height: 812 }); }
  async thenFormFitsViewport() {
    await expect(this.page.getByRole("textbox", { name: "Name", exact: true })).toBeInViewport();
    const input = this.page.getByRole("textbox", { name: "Name", exact: true });
    const button = this.page.getByRole("button", { name: "Add", exact: true });
    await expect(button).toBeInViewport();
    const fieldBounds = await input.boundingBox();
    const buttonBounds = await button.boundingBox();
    expect(fieldBounds).not.toBeNull();
    expect(buttonBounds).not.toBeNull();
    expect(buttonBounds!.x).toBeGreaterThanOrEqual(fieldBounds!.x + fieldBounds!.width);
    expect(Math.abs(buttonBounds!.y - fieldBounds!.y)).toBeLessThan(3);
  }
}
