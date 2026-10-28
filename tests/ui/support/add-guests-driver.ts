import { expect, type Page } from "@playwright/test";
import { BirthdayAdminDriver } from "./birthday-admin-driver";
import { cockpitOrigin } from "./ports";

export class AddGuestsDriver {
  private readonly keyWarnings: string[] = [];

  constructor(private readonly page: Page) {
    page.on("console", message => {
      if (/Each child in a list|same key/.test(message.text())) this.keyWarnings.push(message.text());
    });
  }

  async reloadGuests() {
    await this.page.reload();
    await this.page.getByRole("button", { name: "Alle", exact: true }).click();
  }

  async thenNoKeyWarnings() {
    expect(this.keyWarnings).toEqual([]);
  }

  async open() {
    const admin = new BirthdayAdminDriver(this.page);
    await admin.resetParty();
    await admin.openLogin();
    await admin.loginWithKeyboard();
    await admin.thenGuestsAreVisible();
  }

  async searchFor(name: string) { await this.page.getByRole("textbox", { name: "Gäste suchen" }).fill(name); }
  async enterName(name: string) { await this.page.getByRole("textbox", { name: "Name", exact: true }).fill(name); }
  async submit() { await this.page.getByRole("textbox", { name: "Name", exact: true }).press("Enter"); }
  async thenGuestAppears(name: string, count: number) {
    const row = this.page.getByRole("row").filter({ has: this.page.getByRole("cell", { name, exact: true }) });
    await expect(row).toBeVisible();
    await expect(row.getByRole("cell").nth(1)).toHaveText("Offen");
    await expect(row.getByRole("cell").nth(2)).toContainText("Noch nicht erfasst");
    const existing = this.page.getByRole("row").filter({ has: this.page.getByRole("cell", { name: "Alex Beispiel", exact: true }) });
    await expect(existing.getByRole("cell").nth(1)).toHaveText("Abgesagt");
    await expect(existing.getByRole("cell").nth(2)).toContainText("Nicht eingecheckt");
    await expect(row.getByRole("link", { name: `Einladung für ${name} öffnen` })).toHaveAttribute("href", /\/invite\?id=/);
    await this.thenTotalGuests(count);
    await expect(this.page.getByLabel("Zusagen: 0", { exact: true })).toBeVisible();
    await expect(this.page.getByRole("textbox", { name: "Gäste suchen" })).toHaveValue("");
    await expect(this.page.getByRole("button", { name: "Alle", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(this.page.getByRole("textbox", { name: "Name", exact: true })).toHaveValue("");
    await expect(this.page.getByRole("status")).toHaveText("Gast hinzugefügt.");
  }
  async thenValidationIsVisible() {
    await expect(this.page.getByText("Bitte gib einen Namen mit 1 bis 100 Zeichen ein.")).toBeVisible();
    await this.thenTotalGuests(1);
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
    await expect(this.page.getByRole("button", { name: "Hinzufügen", exact: true })).toBeEnabled();
    await this.thenTotalGuests(1);
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
    await expect(this.page.getByRole("button", { name: "Hinzufügen", exact: true })).toBeDisabled();
    await expect(this.page.getByRole("textbox", { name: "Name", exact: true })).toBeDisabled();
  }
  async useMobileViewport() { await this.page.setViewportSize({ width: 375, height: 812 }); }
  async thenTotalGuests(count: number) {
    await expect(this.page.getByLabel("Gäste: " + count, { exact: true })).toBeVisible();
  }

  async filterBy(label: "Alle" | "Zusagen" | "Offen") {
    await this.page.getByRole("button", { name: label, exact: true }).click();
  }

  async useMixedGuestList() {
    const response = await this.page.request.post(cockpitOrigin + "/__test/guests", {
      data: [
        { _id: "guest-1", name: "Alex Beispiel", accepted: false, checked_in: false },
        { _id: "guest-2", name: "Anna Weber", accepted: true, checked_in: true, companion: true },
        { _id: "guest-3", name: "Felix Schneider", accepted: true, checked_in: false },
        { _id: "guest-4", name: "Laura Fischer", accepted: null, checked_in: null },
      ],
    });
    expect(response.ok()).toBe(true);
    await this.page.reload();
  }

  async thenVisibleGuests(names: string[]) {
    const rows = this.page.getByRole("table").getByRole("row");
    await expect(rows).toHaveCount(names.length + 1);
    for (const name of names) {
      await expect(rows.filter({ has: this.page.getByRole("cell", { name: new RegExp("^" + name) }) })).toHaveCount(1);
    }
  }

  async thenNoMatches() {
    await expect(this.page.getByText("Keine Gäste gefunden.", { exact: true })).toBeVisible();
    await expect(this.page.getByText("0 von 4 Gästen", { exact: true })).toBeVisible();
  }

  async thenMixedSummaryIsVisible() {
    for (const label of ["Gäste: 4", "Zusagen: 2", "Mit Begleitung: 3", "Eingecheckt: 1"]) {
      await expect(this.page.getByLabel(label, { exact: true })).toBeVisible();
    }
  }

  async thenNavigationIsReal() {
    await expect(this.page.getByRole("link", { name: "Scanner", exact: true })).toHaveAttribute("href", "/admin/scanner");
    await expect(this.page.getByRole("link", { name: "Bestellungen", exact: true })).toHaveAttribute("href", "/admin/orders");
    await expect(this.page.getByRole("button", { name: "Abmelden", exact: true })).toHaveCount(1);
    await this.page.getByRole("link", { name: "Einladung für Alex Beispiel öffnen" }).click();
    await expect(this.page.getByRole("heading", { name: "Alex Beispiel, bist du dabei?" })).toBeVisible();
  }

  async thenApprovedStyleAndMobileTableFit() {
    const main = this.page.getByRole("main");
    await expect(main.locator("..")).toHaveCSS("background-color", "rgb(13, 18, 32)");
    await expect(main.getByRole("heading", { name: "Gästeliste" })).toHaveCSS("font-family", /Georgia/);
    expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const tableRegion = this.page.getByRole("region", { name: "Gästetabelle" });
    await expect(tableRegion).toHaveCSS("overflow-x", "auto");
    await tableRegion.focus();
    await tableRegion.press("End");
    await expect(this.page.getByRole("link", { name: "Einladung für Alex Beispiel öffnen" })).toBeInViewport();
  }

  async thenCreationClearsFilters() {
    await expect(this.page.getByRole("cell", { name: "New Guest", exact: true })).toBeVisible();
    await expect(this.page.getByRole("cell", { name: "Alex Beispiel", exact: true })).toBeVisible();
    await expect(this.page.getByRole("textbox", { name: "Gäste suchen" })).toHaveValue("");
    await expect(this.page.getByRole("button", { name: "Alle", exact: true })).toHaveAttribute("aria-pressed", "true");
  }

  async thenFormFitsViewport() {
    await expect(this.page.getByRole("textbox", { name: "Name", exact: true })).toBeInViewport();
    const input = this.page.getByRole("textbox", { name: "Name", exact: true });
    const button = this.page.getByRole("button", { name: "Hinzufügen", exact: true });
    await expect(button).toBeInViewport();
    const fieldBounds = await input.boundingBox();
    const buttonBounds = await button.boundingBox();
    expect(fieldBounds).not.toBeNull();
    expect(buttonBounds).not.toBeNull();
    expect(buttonBounds!.x).toBeGreaterThanOrEqual(fieldBounds!.x + fieldBounds!.width);
    expect(Math.abs(buttonBounds!.y - fieldBounds!.y)).toBeLessThan(3);
  }
}
