import { expect, type Page } from "@playwright/test";
import { AddGuestsDriver } from "./add-guests-driver";
import { cockpitOrigin } from "./ports";

export class GuestVideosDriver {
  constructor(private readonly page: Page) {}
  private toggle(name: string) { return this.page.getByRole("switch", { name: "Video zu " + name + " vorhanden", exact: true }); }
  async open() {
    const guests = new AddGuestsDriver(this.page);
    await guests.useMobileViewport();
    await guests.open();
    await guests.useMixedGuestList();
    await this.showVideos();
  }
  async showVideos() { await this.page.getByText("Videos", { exact: true }).click(); }
  async showOverview() { await this.page.getByText("Übersicht", { exact: true }).click(); }
  async filter(label: string) { await this.page.getByText(label, { exact: true }).click(); }
  async selectGroup(value: string) {
    await this.page.getByRole("textbox", { name: "Gruppe filtern", exact: true }).click();
    await this.page.getByRole("option", { name: value, exact: true }).click();
  }
  async selectHost(value: string) {
    await this.page.getByRole("textbox", { name: "Hosts filtern", exact: true }).click();
    await this.page.getByRole("option", { name: value, exact: true }).click();
  }
  async thenSharedFilters(name: string, group: string, host: string) {
    await expect(this.page.getByRole("textbox", { name: "Gäste suchen" })).toHaveValue(name);
    await expect(this.page.getByRole("textbox", { name: "Gruppe filtern", exact: true })).toHaveValue(group);
    await expect(this.page.getByRole("textbox", { name: "Hosts filtern", exact: true })).toHaveValue(host);
  }
  async thenOverviewGuestCount(count: number) {
    await expect(this.page.getByRole("table").locator("tbody tr")).toHaveCount(count);
  }
  async search(value: string) { await this.page.getByRole("textbox", { name: "Gäste suchen" }).fill(value); }
  async toggleVideo(name: string) { await this.toggle(name).locator("..").click(); }
  async toggleVideoWithKeyboard(name: string) { await this.toggle(name).focus(); await this.toggle(name).press("Space"); }
  async reload() { await this.page.reload(); await this.showVideos(); }
  async thenVideo(name: string, available: boolean) {
    await expect(this.toggle(name).locator("..")).toBeVisible();
    if (available) await expect(this.toggle(name)).toBeChecked();
    else await expect(this.toggle(name)).not.toBeChecked();
  }
  async thenSavedVideo(name: string, video: boolean) {
    await expect.poll(async () => {
      const response = await this.page.request.get(cockpitOrigin + "/__test/state");
      const state = await response.json();
      return state.guests.find((guest: { name: string }) => guest.name === name)?.video;
    }).toBe(video);
    await this.thenVideo(name, video);
    const response = await this.page.request.get(cockpitOrigin + "/__test/state");
    const saved = (await response.json()).guests.find((guest: { name: string }) => guest.name === name);
    expect(saved.groups).toEqual(["Uni"]);
    expect(saved.hosts).toEqual(["Manuel", "Marco"]);
    expect(saved.accepted).toBe(true);
  }
  async thenVideoCount(count: number) { await expect(this.page.getByRole("switch")).toHaveCount(count); }
  async thenFilterCounts(missing: number, available: number) {
    await expect(this.page.getByText("Fehlt · " + missing, { exact: true })).toBeVisible();
    await expect(this.page.getByText("Vorhanden · " + available, { exact: true })).toBeVisible();
  }
  async thenControlsHaveReadableText() {
    for (const scheme of ["light", "dark"]) {
      await this.page.evaluate(value => document.documentElement.setAttribute("data-mantine-color-scheme", value), scheme);
      for (const width of [375, 1280]) {
        await this.page.setViewportSize({ width, height: 812 });
        await this.page.mouse.move(0, 0);
        for (const text of ["Videos", "Alle"]) {
          await expect(this.page.getByText(text, { exact: true })).toHaveCSS("color", "rgb(247, 243, 237)");
        }
        for (const text of ["Übersicht", "Fehlt · 4", "Vorhanden · 0"]) {
          const label = this.page.getByText(text, { exact: true });
          await expect(label).toHaveCSS("color", "rgb(194, 188, 186)");
          await label.hover();
          await expect(label).toHaveCSS("color", "rgb(247, 243, 237)");
          await this.page.mouse.move(0, 0);
        }
        await this.filter("Fehlt · 4");
        await this.page.mouse.move(0, 0);
        await expect(this.page.getByText("Fehlt · 4", { exact: true })).toHaveCSS("color", "rgb(247, 243, 237)");
        await expect(this.page.getByText("Alle", { exact: true })).toHaveCSS("color", "rgb(194, 188, 186)");
        await this.filter("Alle");
      }
    }
  }
  async thenOverviewIsIntact() { await expect(this.page.getByRole("table")).toBeVisible(); }
  async thenMinimalMobileView() {
    await expect(this.page.getByRole("columnheader", { name: "Video vorhanden" })).toBeVisible();
    await expect(this.page.getByText("Gäste mit Video", { exact: true })).toHaveCount(0);
    await expect(this.page.getByText("Vorhanden", { exact: true })).toHaveCount(0);
    await expect(this.page.getByText("Fehlt", { exact: true })).toHaveCount(0);
    for (const width of [320, 375, 1280]) {
      await this.page.setViewportSize({ width, height: 812 });
      expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
  async failNextSave() {
    await this.page.route("**/api/guests/video", route => route.fulfill({
      status: 502, contentType: "application/json", body: JSON.stringify({ error: "failed" }),
    }), { times: 1 });
  }
  async thenSaveFailed() {
    await expect(this.page.getByRole("alert").filter({ hasText: "Video-Status" })).toContainText("Video-Status konnte nicht gespeichert werden");
  }
  async holdSave() {
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await this.page.route("**/api/guests/video", async route => { await gate; await route.continue(); }, { times: 1 });
    return release;
  }
  async thenSaving() { await expect(this.toggle("Anna Weber")).toBeDisabled(); }
}
