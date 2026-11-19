import { expect, type Page } from '@playwright/test';
import { SuperstarLiveDriver } from './superstar-live-driver';

export class SuperstarEditorDriver {
  private projector?: Page;
  constructor(private readonly page: Page) {}
  async dispose() { await this.projector?.close(); }
  async openProjector() {
    this.projector = await this.page.context().newPage();
    await this.projector.goto('/superstar/projector');
    await expect(this.projector.getByRole('heading')).toContainText('Joschua');
  }
  async open() {
    const live = new SuperstarLiveDriver(this.page);
    await live.prepareShow();
    await this.page.getByRole('button', { name: 'Shows bearbeiten', exact: true }).click();
    await expect(this.page.getByRole('heading', { name: 'Shows bearbeiten', exact: true })).toBeVisible();
  }
  async add(name: string) {
    await this.page.getByRole('button', { name: 'Show hinzufügen' }).click();
    await this.page.getByRole('textbox', { name: 'Name', exact: true }).fill(name);
    await this.page.getByRole('textbox', { name: 'Titel', exact: true }).fill('Neuer Titel');
    await this.page.getByRole('textbox', { name: 'Beschreibung', exact: true }).fill('Eine neue Beschreibung');
  }
  async save() {
    await this.page.getByRole('button', { name: 'Speichern', exact: true }).click();
    await expect(this.page.getByRole('status')).toHaveText('Gespeichert');
  }
  async setTitle(title: string) { await this.page.getByRole('textbox', { name: 'Titel', exact: true }).fill(title); }
  async shouldPreview(title: string) { await expect(this.page.getByRole('region', { name: 'Beamer-Entwurf' })).toContainText(title); }
  async shouldKeepDraftAfterFailure() {
    await this.page.route('**/api/superstar/shows', route => route.fulfill({ status: 502, json: { error: 'Speichern nicht bestätigt.' } }));
    await this.page.getByRole('button', { name: 'Speichern', exact: true }).click();
    await expect(this.page.getByRole('main').getByRole('alert')).toContainText('Speichern nicht bestätigt');
    await expect(this.page.getByRole('textbox', { name: 'Titel', exact: true })).toHaveValue('Nicht gespeichert');
    await this.page.unroute('**/api/superstar/shows');
  }
  async discard() { await this.page.getByRole('button', { name: 'Verwerfen', exact: true }).click(); }
  async shouldHaveTitle(title: string) { await expect(this.page.getByRole('textbox', { name: 'Titel', exact: true })).toHaveValue(title); }
  async shouldGuardNavigation() {
    await this.page.getByRole('button', { name: 'Zur Regie', exact: true }).click();
    await expect(this.page.getByRole('dialog')).toContainText('Ungespeicherte Änderungen');
    await this.page.getByRole('button', { name: 'Weiter bearbeiten', exact: true }).click();
    await this.shouldHaveTitle('Nicht gespeichert');
  }
  async uploadTwoImages() {
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
    await this.page.locator('input[type=file]').setInputFiles([
      { name: 'first.png', mimeType: 'image/png', buffer: png },
      { name: 'second.png', mimeType: 'image/png', buffer: png },
    ]);
    await expect(this.page.getByRole('button', { name: 'Bild 2 in Vorschau anzeigen', exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Speichern', exact: true })).toBeEnabled();
  }
  async shouldPreviewSecondImage() {
    await this.page.getByRole('button', { name: 'Bild 2 in Vorschau anzeigen', exact: true }).click();
    const preview = this.page.getByRole('region', { name: 'Beamer-Entwurf' }).locator('img');
    await expect(preview).toHaveAttribute('src', /asset-/);
    await expect.poll(() => preview.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  async removeSecondImage() {
    await this.page.getByRole('button', { name: 'Bild 2 entfernen', exact: true }).click();
    await expect(this.page.getByRole('button', { name: 'Bild 2 in Vorschau anzeigen', exact: true })).toHaveCount(0);
  }
  async returnToControl() { await this.page.getByRole('button', { name: 'Zur Regie', exact: true }).click(); }
  async shouldKeepActiveAct() { await expect(this.page.getByRole('region', { name: 'Beamer-Vorschau' }).getByRole('heading')).toContainText('Joschua'); }
  async selectAct(name: string) { await new SuperstarLiveDriver(this.page).selectAct(name); }
  async shouldShowLiveContent(name: string, title: string) {
    const preview = this.page.getByRole('region', { name: 'Beamer-Vorschau' });
    await expect(preview.getByRole('heading')).toContainText(name);
    await expect(preview).toContainText(title);
    await expect(preview).toContainText('Eine neue Beschreibung');
    if (this.projector) {
      await expect(this.projector.getByRole('heading')).toContainText(name);
      await expect(this.projector.getByRole('main')).toContainText(title);
    }
  }
  async selectSecondLiveImage() {
    await this.page.getByRole('textbox', { name: 'Beamerbild', exact: true }).click();
    await this.page.getByRole('option', { name: 'Bild 2', exact: true }).click();
    await expect(this.page.getByRole('textbox', { name: 'Beamerbild', exact: true })).toHaveValue('Bild 2');
    if (this.projector) {
      const src = await this.page.getByRole('region', { name: 'Beamer-Vorschau' }).locator('img').getAttribute('src');
      await expect(this.projector.getByRole('main').locator('img')).toHaveAttribute('src', src!);
    }
  }
  async reload() { await this.page.reload(); await expect(this.page.getByRole('status', { name: 'Verbunden' })).toBeVisible(); }
  async shouldFitMobile() {
    await this.page.setViewportSize({ width: 375, height: 812 });
    expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
}
