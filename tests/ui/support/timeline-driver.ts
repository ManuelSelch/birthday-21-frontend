import { expect, type Page } from "@playwright/test";
import { cockpitOrigin } from "./ports";

export class TimelineDriver {
  constructor(private readonly page: Page) {}

  async reset() { await this.page.request.post(cockpitOrigin + "/__test/reset"); }
  async useViewport(width: number) { await this.page.setViewportSize({ width, height: 900 }); }
  async setSchedule(entries: unknown, fail = false) {
    await this.page.request.post(cockpitOrigin + "/__test/timeline", { data: { entries, fail } });
  }
  async useExampleSchedule() {
    await this.setSchedule([
      { _id: "dance", title: "Musik & Tanz", subtitle: null, description: null, start: "2026-11-15 00:30", internalNote: "private test marker" },
      { _id: "arrival", title: "Empfang", subtitle: "Ankommen", description: "Erst mal ankommen, etwas trinken und Hallo sagen.", start: "2026-11-14 19:00" },
      { _id: "dinner", title: "Abendessen", subtitle: "Gemeinsam genießen", description: "Wir essen gemeinsam.", start: "2026-11-14T18:45:00Z" },
    ]);
  }
  async open() { await this.page.goto("/timeline"); }
  async openFromInvitation() {
    await this.page.goto("/invite?id=guest-1");
    await this.page.getByRole("link", { name: "Programm ansehen" }).click();
  }
  async returnToInvitation() { await this.page.getByRole("link", { name: "Zur Einladung" }).click(); }
  async thenPersonalReturnLink() {
    await expect(this.page).toHaveURL(/\/timeline\?id=guest-1$/);
    await expect(this.page.getByRole("link", { name: "Zur Einladung" })).toHaveAttribute("href", "/invite?id=guest-1");
  }
  async thenInvitationIsPreserved() {
    await expect(this.page).toHaveURL(/\/invite\?id=guest-1$/);
    await expect(this.page.getByRole("heading", { name: "Alex Beispiel, bist du dabei?" })).toBeVisible();
  }
  async thenProgrammeIsVisible() {
    await expect(this.page.getByRole("heading", { name: "Programm", exact: true })).toBeVisible();
    const schedule = this.page.getByRole("region", { name: "Ablauf des Abends" });
    await expect(schedule.getByRole("heading")).toHaveText(["Empfang", "Abendessen", "Musik & Tanz"]);
    await expect(schedule.locator("time")).toHaveText(["19:00", "19:45", "00:30"]);
    await expect(schedule.getByText("Ankommen", { exact: true })).toBeVisible();
    await expect(schedule.getByText("Wir essen gemeinsam.", { exact: true })).toBeVisible();
    await expect(schedule.getByRole("button")).toHaveCount(0);
    await expect(this.page.getByText("DER ABEND IM ÜBERBLICK", { exact: true })).toHaveCount(0);
    expect(await this.page.content()).not.toContain("private test marker");
    expect(await this.page.content()).not.toContain("isolated-test-key");
  }
  async thenNoReturnLink() { await expect(this.page.getByRole("link", { name: "Zur Einladung" })).toHaveCount(0); }
  async thenEmpty() { await expect(this.page.getByRole("status")).toHaveText("Das Programm folgt in Kürze."); }
  async thenUnavailable() {
    await expect(this.page.getByRole("status")).toContainText("Das Programm ist gerade nicht verfügbar.");
    await expect(this.page.getByRole("list")).toHaveCount(0);
    expect(await this.page.content()).not.toContain("private upstream detail");
  }
  async thenLayoutFits() {
    expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(this.page.getByRole("main")).toHaveCSS("color", "rgb(247, 243, 237)");
    const header = (await this.page.getByRole("heading", { name: "Programm", exact: true }).boundingBox())!;
    const schedule = (await this.page.getByRole("region", { name: "Ablauf des Abends" }).boundingBox())!;
    if (this.page.viewportSize()!.width <= 760) {
      expect(schedule.y).toBeGreaterThan(header.y + header.height);
    } else {
      expect(schedule.x).toBeGreaterThan(header.x + header.width);
    }
  }
}
