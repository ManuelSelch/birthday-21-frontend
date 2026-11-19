import { expect, type Page } from '@playwright/test';

export class SuperstarDriver {
  constructor(private readonly page: Page) {}

  private projector() { return this.page.getByRole('region', { name: 'Beamer-Vorschau' }); }
  private jury() { return this.page.getByRole('region', { name: 'Jury-Displays' }); }

  async open(scene?: string, width = 900) {
    await this.page.setViewportSize({ width, height: 1090 });
    await this.page.goto('/superstar' + (scene ? '?scene=' + scene : ''));
    await expect(this.page.getByRole('heading', { name: 'Ein Abend. Lauter Superstars.' })).toBeVisible();
  }
  async selectScene(name: string) { await this.page.getByRole('button', { name, exact: true }).click(); }
  async selectPerformer(name: string) {
    await this.page.getByRole('textbox', { name: 'Act für die Vorschau', exact: true }).click();
    await this.page.getByRole('option', { name, exact: true }).click();
  }
  async buzz(name: string) { await this.page.getByRole('button', { name: new RegExp('^' + name) }).click(); }
  async celebrate() { await this.page.getByRole('button', { name: 'Goldener Moment für alle' }).click(); }
  async reset() { await this.page.getByRole('button', { name: 'Reaktionen zurücksetzen' }).click(); }
  async showOnlyProjector() {
    await this.page.getByText('Nur Beamer', { exact: true }).click();
    await expect(this.page.getByRole('switch', { name: 'Nur Beamer' })).toBeChecked();
  }
  async showControls() {
    await this.page.getByText('Nur Beamer', { exact: true }).click();
    await expect(this.page.getByRole('switch', { name: 'Nur Beamer' })).not.toBeChecked();
  }
  async selectJuryMotifs() {
    await expect(this.page.getByText('Namen', { exact: true })).toHaveCount(0);
    await expect(this.page.getByText('Porträts', { exact: true })).toBeVisible();
    await this.page.getByText('Motive', { exact: true }).click();
  }
  async pauseTime() {
    await this.page.clock.install();
    await this.page.clock.pauseAt(new Date(Date.now() + 1000));
  }
  async advanceTime(milliseconds: number) { await this.page.clock.fastForward(milliseconds); }

  async shouldShowAct(name = 'Joschua') {
    await expect(this.projector().getByRole('heading')).toContainText(name);
    await expect(this.projector().getByText('FOTO-PLATZHALTER')).toBeVisible();
  }
  async shouldShowCamera() { await expect(this.projector().getByText('KAMERA-VORSCHAU / SIMULIERT')).toBeVisible(); }
  async shouldShowVoting() { await expect(this.projector().getByRole('heading', { name: 'Welchen Preis verdient dieser Act?' })).toBeVisible(); }
  async shouldShowResults() {
    await expect(this.projector().getByRole('heading', { name: 'Pokal der offenen Münder' })).toBeVisible();
    for (const percentage of ['27 %', '24 %', '49 %'])
      await expect(this.projector().getByText(percentage, { exact: true })).toBeVisible();
    await expect(this.projector().getByText(/erfundene Vorschauwerte/)).toBeVisible();
  }
  async shouldKeepSceneOnReload() {
    await expect(this.page).toHaveURL(/scene=results/);
    await this.page.reload();
    await this.shouldShowResults();
  }
  async shouldShowPause() { await expect(this.projector().getByText('Kurze Pause. Großer Applaus.')).toBeVisible(); }
  async shouldShowReaction(name: string) { await expect(this.projector().getByRole('status')).toContainText(name.toUpperCase() + ' FEIERT DICH'); }
  async shouldShowNoReaction() { await expect(this.projector().getByRole('status')).toHaveCount(0); }
  async shouldShowJurorReaction(text: string) { await expect(this.jury().getByText(text, { exact: true })).toBeVisible(); }
  async shouldShowNoJurorReaction(text: string) { await expect(this.jury().getByText(text, { exact: true })).toHaveCount(0); }
  async shouldShowGoldenMoment() { await expect(this.projector().getByText(/Das ist dein/)).toBeVisible(); }
  async shouldShowNoGoldenMoment() { await expect(this.projector().getByText(/Das ist dein/)).toHaveCount(0); }
  async shouldShowMotifs() { await expect(this.jury().getByText('GEMEINSAM WIRD’S GROSS', { exact: true })).toHaveCount(3); }
  async shouldShowOnlyProjector() {
    await expect(this.projector()).toBeVisible();
    await expect(this.jury()).toBeHidden();
    await expect(this.page.getByRole('button', { name: 'Goldener Moment für alle' })).toBeHidden();
  }
  async shouldMatchBirthdayLayout() {
    expect(await this.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(this.page.getByRole('main')).toHaveCSS('color', 'rgb(247, 243, 237)');
    const title = this.page.getByRole('heading', { name: 'Ein Abend. Lauter Superstars.' });
    await expect(title).toHaveCSS('font-family', /Georgia/);
    await expect(this.jury().getByRole('img')).toHaveCount(3);
    await expect(this.page.getByText('APP-STIL UND ORIGINALENTWÜRFE')).toHaveCount(0);
    await expect(this.page.getByText('ABSTIMMEN OHNE NOTEN')).toHaveCount(0);
    await expect(this.page.getByText(/Lokaler Designentwurf/)).toHaveCount(0);
  }
}
