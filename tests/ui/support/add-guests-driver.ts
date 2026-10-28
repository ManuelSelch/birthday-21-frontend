import { expect, type Page } from "@playwright/test";
import { BirthdayAdminDriver } from "./birthday-admin-driver";
import { cockpitOrigin } from "./ports";

export class AddGuestsDriver {
  private readonly keyWarnings: string[] = [];
  constructor(private readonly page: Page) {
    page.on("console", message => { if (/Each child in a list|same key/.test(message.text())) this.keyWarnings.push(message.text()); });
  }
  private details(name: string) { return this.page.getByRole("button", { name: name + " · Details und Einladungslink", exact: true }); }
  private row(name: string) { return this.page.getByRole("row").filter({ has: this.details(name) }); }
  private dialog() { return this.page.getByRole("dialog"); }
  private async openCreation() {
    if (!await this.dialog().isVisible()) await this.page.getByRole("button", { name: "Gast", exact: true }).click();
  }
  async reloadGuests() {
    await expect(this.dialog()).not.toBeVisible();
    await expect(this.page.getByText("Zuordnung gespeichert.", { exact: true })).toHaveCount(0);
    await this.page.reload();
    await this.page.getByRole("button", { name: "Alle", exact: true }).click();
  }
  async thenNoKeyWarnings() { expect(this.keyWarnings).toEqual([]); }
  async open() {
    const admin = new BirthdayAdminDriver(this.page);
    await admin.resetParty(); await admin.openLogin(); await admin.loginWithKeyboard(); await admin.thenGuestsAreVisible();
  }
  async searchFor(name: string) { await this.page.getByRole("textbox", { name: "Gäste suchen" }).fill(name); }
  async enterName(name: string) { await this.openCreation(); await this.page.getByRole("textbox", { name: "Name", exact: true }).fill(name); }
  async submit() { await this.page.getByRole("textbox", { name: "Name", exact: true }).press("Enter"); }
  async thenGuestAppears(name: string, count: number) {
    const row = this.row(name);
    await expect(row).toBeVisible();
    await expect(row.getByRole("img", { name: "Offen", exact: true })).toBeVisible();
    await expect(row.getByRole("cell").last()).toContainText("Noch nicht erfasst");
    const existing = this.row("Alex Beispiel");
    await expect(existing.getByRole("img", { name: "Abgesagt", exact: true })).toBeVisible();
    await expect(existing.getByRole("cell").last()).toContainText("Nicht eingecheckt");
    await this.thenTotalGuests(count);
    await expect(this.page.getByLabel("Zusagen: 0", { exact: true })).toBeVisible();
    await expect(this.page.getByRole("textbox", { name: "Gäste suchen" })).toHaveValue("");
    await expect(this.page.getByRole("button", { name: "Alle", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(this.dialog()).not.toBeVisible();
    await expect(this.page.getByRole("status")).toHaveText("Gast hinzugefügt.");
  }
  async thenValidationIsVisible() {
    await expect(this.dialog().getByRole("alert")).toContainText("Bitte gib einen Namen mit 1 bis 100 Zeichen ein");
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
    await expect(this.dialog().getByRole("alert")).toContainText("Gast konnte nicht hinzugefügt werden.");
    await expect(this.page.getByRole("textbox", { name: "Name", exact: true })).toHaveValue(name);
    await expect(this.page.getByRole("button", { name: "Gast hinzufügen", exact: true })).toBeEnabled();
    await this.thenTotalGuests(1);
  }
  async holdSave() {
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await this.page.route("**/api/guests", async route => {
      if (route.request().method() !== "POST") return route.continue();
      await gate; await route.continue();
    });
    return release;
  }
  async thenSubmissionIsDisabled() {
    await expect(this.page.getByRole("button", { name: "Gast hinzufügen", exact: true })).toBeDisabled();
    await expect(this.page.getByRole("textbox", { name: "Name", exact: true })).toBeDisabled();
    await expect(this.page.getByRole("button", { name: "Manuel", exact: true })).toBeDisabled();
  }
  async useMobileViewport() { await this.page.setViewportSize({ width: 375, height: 812 }); }
  async thenTotalGuests(count: number) { await expect(this.page.getByLabel("Gäste: " + count, { exact: true })).toBeVisible(); }
  async filterBy(label: "Alle" | "Zusagen" | "Zugesagt" | "Offen" | "Abgesagt") {
    await this.page.getByRole("button", { name: label === "Zusagen" ? "Zugesagt" : label, exact: true }).click();
  }
  async useMixedGuestList() {
    const response = await this.page.request.post(cockpitOrigin + "/__test/guests", { data: [
      { _id: "guest-1", name: "Alex Beispiel", groups: [], hosts: [], invited: false, accepted: false, checked_in: false },
      { _id: "guest-2", name: "Anna Weber", groups: ["Uni"], hosts: ["Manuel", "Marco"], invited: true, accepted: true, checked_in: true, companion: true },
      { _id: "guest-3", name: "Felix Schneider", groups: ["Fußball"], hosts: ["David"], accepted: true, checked_in: false },
      { _id: "guest-4", name: "Laura Fischer", groups: [], hosts: [], accepted: null, checked_in: null },
    ] });
    expect(response.ok()).toBe(true); await this.page.reload();
  }
  async thenCompactInvitationLinksAreVisible() {
    const table = this.page.getByRole("table");
    await expect(table.locator("thead th")).toHaveText(["Gast", "Gruppen / Hosts", "Gruppen", "Hosts", "Status", "Check-in"]);
    await expect(table.getByText("+1 Begleitung", { exact: true })).toHaveCount(0);
    await expect(this.details("Alex Beispiel")).toHaveCSS("color", "rgb(217, 189, 134)");
    await expect(this.details("Anna Weber")).toHaveCSS("color", "rgb(174, 182, 198)");
    await expect(table.getByRole("columnheader").last()).toHaveCSS("text-align", "center");
    await expect(this.page.getByText(/\d+ von \d+ Gästen/)).toHaveCount(0);
    await expect(this.row("Alex Beispiel").locator("td").nth(2)).toHaveText("—");
    await expect(this.row("Alex Beispiel").locator("td").nth(3)).toHaveText("—");
    await expect(this.details("Alex Beispiel")).toHaveText("Alex Beispiel");
    await expect(this.page.getByRole("button", { name: "Auswählen", exact: true })).toHaveCount(0);
    await expect(table.getByRole("checkbox")).toHaveCount(0);
    for (const width of [320, 375, 390, 640, 1280]) {
      await this.page.setViewportSize({ width, height: 812 });
      expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      const region = this.page.getByRole("region", { name: "Gästetabelle" });
      expect(await region.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
      await expect(table.getByRole("columnheader")).toHaveText(width < 700
        ? ["Gast", "Gruppen / Hosts", "Status", "Check-in"]
        : ["Gast", "Gruppen", "Hosts", "Status", "Check-in"]);
      if (width < 700) {
        const checkinHeading = table.getByRole("columnheader", { name: "Check-in", exact: true });
        await expect(checkinHeading).toHaveCSS("white-space", "nowrap");
        expect(await checkinHeading.evaluate(element => {
          const range = document.createRange();
          range.selectNodeContents(element);
          return range.getClientRects().length === 1 && range.getBoundingClientRect().width <= element.clientWidth;
        })).toBe(true);
        await expect(this.details("Anna Weber").locator("strong")).toHaveCSS("font-size", "15px");
        const assignments = this.row("Anna Weber").getByRole("cell").nth(1);
        await expect(assignments).toContainText("Uni");
        await expect(assignments).toContainText("Manuel, Marco");
        await expect(assignments).toHaveCSS("font-size", "14px");
      }
      for (const [name, status, color] of [
          ["Anna Weber", "Zugesagt", "rgb(22, 163, 74)"],
          ["Alex Beispiel", "Abgesagt", "rgb(240, 128, 128)"],
          ["Laura Fischer", "Offen", "rgb(100, 112, 132)"],
        ]) {
          const indicator = this.row(name).getByRole("img", { name: status, exact: true });
          await expect(indicator).toBeVisible();
          await expect(indicator).toHaveCSS("width", "14px");
          await expect(indicator).toHaveCSS("height", "14px");
          await expect(indicator).toHaveCSS("background-color", color);
          await expect(this.row(name).getByText(status, { exact: true })).not.toBeVisible();
      }
      const cell = this.row("Anna Weber").getByRole("cell").last();
      const cellBounds = await cell.boundingBox();
      const iconBounds = await cell.locator("svg").boundingBox();
      expect(cellBounds).not.toBeNull();
      expect(iconBounds).not.toBeNull();
      if (width < 700) {
        const statusBounds = await this.row("Anna Weber").getByRole("img", { name: "Zugesagt", exact: true }).boundingBox();
        expect(statusBounds).not.toBeNull();
        expect(iconBounds!.x - (statusBounds!.x + statusBounds!.width)).toBeGreaterThan(36);
      }
      expect(Math.abs(iconBounds!.x + iconBounds!.width / 2 - (cellBounds!.x + cellBounds!.width / 2))).toBeLessThan(1);
      expect(Math.abs(iconBounds!.y + iconBounds!.height / 2 - (cellBounds!.y + cellBounds!.height / 2))).toBeLessThan(1);
    }
  }
  async thenVisibleGuests(names: string[]) {
    await expect(this.page.getByRole("table").getByRole("row")).toHaveCount(names.length + 1);
    for (const name of names) await expect(this.row(name)).toHaveCount(1);
  }
  async thenNoMatches() {
    await expect(this.page.getByText("Keine Gäste gefunden.", { exact: true })).toBeVisible();
    await expect(this.page.getByText(/\d+ von \d+ Gästen/)).toHaveCount(0);
  }
  async thenMixedSummaryIsVisible() {
    for (const label of ["Gäste: 4", "Zusagen: 2", "Eingecheckt: 1"]) await expect(this.page.getByLabel(label, { exact: true })).toBeVisible();
    await expect(this.page.getByLabel("Mit Begleitung: 3", { exact: true })).toHaveCount(1);
  }
  async thenNavigationIsReal() {
    await expect(this.page.getByRole("banner").getByRole("link", { name: "Scanner", exact: true })).toHaveAttribute("href", "/admin/scanner");
    await expect(this.page.getByRole("link", { name: "Bestellungen", exact: true })).toHaveCount(0);
    await expect(this.page.getByRole("button", { name: "Abmelden", exact: true })).toHaveCount(1);
    await this.editGuest("Alex Beispiel");
    await this.page.getByRole("link", { name: "Einladung öffnen", exact: true }).click();
    await expect(this.page.getByRole("heading", { name: "Alex Beispiel, bist du dabei?" })).toBeVisible();
  }
  async thenApprovedStyleAndMobileTableFit() {
    const main = this.page.getByRole("main");
    await expect(main.locator("..")).toHaveCSS("background-color", "rgb(13, 18, 32)");
    await expect(main.getByRole("heading", { name: "Gäste", exact: true })).toHaveCSS("font-family", /Georgia/);
    expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const region = this.page.getByRole("region", { name: "Gästetabelle" });
    await expect(region).toHaveCSS("overflow-x", "auto");
    expect(await region.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect(this.details("Alex Beispiel")).toBeInViewport();
  }
  async thenCreationClearsFilters() {
    await expect(this.details("New Guest")).toBeVisible(); await expect(this.details("Alex Beispiel")).toBeVisible();
    await expect(this.page.getByRole("textbox", { name: "Gäste suchen" })).toHaveValue("");
    await expect(this.page.getByRole("button", { name: "Alle", exact: true })).toHaveAttribute("aria-pressed", "true");
  }
  async thenFormFitsViewport() {
    await this.openCreation();
    await expect(this.page.getByRole("textbox", { name: "Name", exact: true })).toBeInViewport();
    await expect(this.page.getByRole("button", { name: "Gast hinzufügen", exact: true })).toBeInViewport();
    expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await this.page.keyboard.press("Escape");
    await expect(this.dialog()).not.toBeVisible();
  }
  async editGuest(name: string) { await this.details(name).click(); await expect(this.dialog()).toBeVisible(); }
  async thenPopupMatchesApprovedStyle(title: string, action: string) {
    const dialog = this.dialog();
    const heading = dialog.getByRole("heading", { name: title, exact: true });
    const save = dialog.getByRole("button", { name: action, exact: true });
    await expect(heading).toHaveCSS("font-size", "30px");
    await expect(heading).toHaveCSS("font-weight", "600");
    await expect(save).toHaveCSS("background-color", "rgb(66, 106, 154)");
    await expect(save).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(dialog.getByRole("textbox", { name: "Einladungslink", exact: true })).toHaveCount(0);
    const headingBounds = await heading.boundingBox();
    const actionBounds = await save.boundingBox();
    expect(headingBounds).not.toBeNull();
    expect(actionBounds).not.toBeNull();
    expect(Math.abs(headingBounds!.x - actionBounds!.x)).toBeLessThanOrEqual(4);
    await expect(heading).toBeInViewport();
    await expect(save).toBeInViewport();
    expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  async closePopup() { await this.page.keyboard.press("Escape"); await expect(this.dialog()).not.toBeVisible(); }
  async thenSelectedHostIsBlue(name: string) {
    await expect(this.dialog().getByRole("button", { name, exact: true })).toHaveCSS("background-color", "rgb(66, 106, 154)");
  }
  async createGroup(name: string) {
    await this.page.getByRole("textbox", { name: "Neue Gruppe", exact: true }).fill(name);
    await this.page.getByRole("button", { name: "Gruppe erstellen und auswählen" }).click();
  }
  async toggleHost(name: string) { await this.dialog().getByRole("button", { name, exact: true }).click(); }
  async saveAssignments() { await this.dialog().getByRole("button", { name: "Speichern", exact: true }).click(); }
  async thenGuestAssignments(name: string, groups: string[], hosts: string[]) {
    const row = this.row(name);
    await expect(row).toBeVisible();
    await this.editGuest(name);
    const response = await this.page.request.get(cockpitOrigin + "/__test/state");
    const saved = (await response.json()).guests.find((g: { name: string }) => g.name === name);
    expect(saved.groups).toEqual(groups); expect(saved.hosts).toEqual(hosts);
    for (const host of ["Manuel", "Marco", "David"]) await expect(this.dialog().getByRole("button", { name: host, exact: true })).toHaveAttribute("aria-pressed", String(hosts.includes(host)));
    for (const group of groups) await expect(this.dialog().getByText(group, { exact: true })).toBeVisible();
    await this.page.keyboard.press("Escape");
  }
  async filterByGroup(name: string) {
    await this.page.getByRole("textbox", { name: "Gruppe filtern", exact: true }).click();
    await this.page.getByRole("option", { name, exact: true }).click();
  }
  async filterByHost(name: string) {
    await this.page.getByRole("textbox", { name: "Hosts filtern", exact: true }).click();
    await this.page.getByRole("option", { name, exact: true }).click();
  }
  async thenInvitationCanBeCopied(name: string) {
    await this.page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await this.editGuest(name);
    const expectedLink = new URL("/invite?id=guest-1", this.page.url()).href;
    await expect(this.dialog().getByRole("textbox", { name: "Einladungslink", exact: true })).toHaveCount(0);
    await expect(this.dialog().getByRole("link", { name: "Einladung öffnen", exact: true })).toHaveAttribute("href", expectedLink);
    await this.dialog().getByRole("button", { name: "Einladungslink kopieren" }).click();
    await expect(this.dialog().getByRole("status")).toHaveText("Einladungslink kopiert.");
    expect(await this.page.evaluate(() => navigator.clipboard.readText())).toBe(expectedLink);
  }
  async useInvalidGuestAssignments(groups: unknown, hosts: unknown) {
    const data: Record<string, unknown> = { _id: "bad-guest", name: "Invalid Example" };
    if (groups !== undefined) data.groups = groups;
    if (hosts !== undefined) data.hosts = hosts;
    const response = await this.page.request.post(cockpitOrigin + "/__test/guests", { data: [data] });
    expect(response.ok()).toBe(true);
    await this.page.reload();
  }
  async thenGuestDataErrorIsVisible() {
    await expect(this.page.getByRole("heading", { name: "Gästedaten prüfen" })).toBeVisible();
    const error = this.page.getByRole("alert").filter({ hasText: "Cockpit ungültige Gästedaten" });
    await expect(error).toContainText("bad-guest");
    await expect(error).toContainText("groups");
    await expect(error).toContainText("hosts");
    await expect(this.page.getByText("[@mantine/core] Each option must have value property", { exact: false })).toHaveCount(0);
    await expect(this.page.getByRole("textbox", { name: "Gruppe filtern", exact: true })).toHaveCount(0);
  }

  async failNextAssignmentSave() {
    let failed = false;
    await this.page.route("**/api/guests/assignments", async route => {
      if (failed) return route.continue(); failed = true;
      await route.fulfill({ status: 502, contentType: "application/json", body: "{}" });
    });
  }
  async thenAssignmentSaveFailed() {
    await expect(this.dialog().getByRole("alert")).toContainText("Zuordnung konnte nicht gespeichert werden.");
    await expect(this.dialog().getByRole("button", { name: "David", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(this.dialog().getByText("Uni", { exact: true })).toBeVisible();
  }
}
