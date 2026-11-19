import { expect, type BrowserContext, type Page } from '@playwright/test';

export class SuperstarLiveDriver {
  private displays?: BrowserContext;
  private projector?: Page;
  private jurors: Page[] = [];

  constructor(private readonly control: Page) {}
  async dispose() { await this.displays?.close(); }

  async openProtectedControl() { await this.control.goto('/superstar/control'); }
  async shouldRequireLogin() {
    await expect(this.control).toHaveURL(/\/admin\/login\?returnTo=%2Fsuperstar%2Fcontrol/);
    await expect(this.control.getByRole('heading', { name: 'Admin-Anmeldung' })).toBeVisible();
  }
  async login() {
    const response = await this.control.request.post('/api/admin/login', {
      data: { password: 'birthday test password', returnTo: '/superstar/control' },
    });
    expect(response.ok()).toBe(true);
    expect((await response.json()).redirectTo).toBe('/superstar/control');
  }
  async prepareShow() {
    await this.login();
    for (const command of [{ type: 'reset' }, { type: 'scene', scene: 'act' }, { type: 'performer', index: 0 }, { type: 'mode', mode: 'portraits' }])
      expect((await this.control.request.post('/api/superstar/commands', { data: command })).ok()).toBe(true);
    await this.control.goto('/superstar/control');
    await expect(this.control.getByRole('status', { name: '', exact: true }).filter({ hasText: 'Verbunden' })).toBeVisible();
  }
  async openScreens() {
    this.displays = await this.control.context().browser()!.newContext({ viewport: { width: 900, height: 1090 } });
    const login = await this.displays.request.post(new URL('/api/admin/login', this.control.url()).href, {
      data: { password: 'birthday test password', returnTo: '/superstar/projector' },
    });
    expect(login.ok()).toBe(true);
    this.projector = await this.displays.newPage();
    await this.projector.goto(new URL('/superstar/projector', this.control.url()).href);
    for (const id of ['manuel', 'marco', 'david']) {
      const page = await this.displays.newPage();
      await page.goto(new URL('/superstar/jury/' + id, this.control.url()).href);
      this.jurors.push(page);
    }
    await expect(this.projector.getByRole('heading')).toContainText('Joschua');
    for (let index = 0; index < this.jurors.length; index++)
      await expect(this.jurors[index].getByRole('main')).toContainText(['Manuel', 'Marco', 'David'][index]);
  }
  async selectScene(name: string) { await this.control.getByRole('button', { name, exact: true }).click(); }
  async selectAct(name: string) {
    await this.control.getByRole('textbox', { name: 'Act für die Vorschau', exact: true }).click();
    await this.control.getByRole('option', { name, exact: true }).click();
  }
  async buzz(name: string) { await this.control.getByRole('button', { name: new RegExp('^' + name) }).click(); }
  async celebrate() { await this.control.getByRole('button', { name: 'Goldener Moment für alle' }).click(); }
  async reset() { await this.control.getByRole('button', { name: 'Reaktionen zurücksetzen' }).click(); }
  async selectMotifs() {
    await expect(this.control.getByText('Namen', { exact: true })).toHaveCount(0);
    await expect(this.control.getByText('Porträts', { exact: true })).toBeVisible();
    await this.control.getByText('Motive', { exact: true }).click();
  }
  async reloadProjector() { await this.projector!.reload(); }
  async disconnectScreens() { await this.displays!.setOffline(true); }
  async reconnectScreens() { await this.displays!.setOffline(false); }

  async shouldShowAct(name: string) { await expect(this.projector!.getByRole('heading')).toContainText(name); }
  async shouldShowResults() { await expect(this.projector!.getByRole('heading')).toHaveText('Pokal der offenen Münder'); }
  async shouldShowReaction(name: string, index: number, text: string) {
    await expect(this.projector!.getByRole('status')).toContainText(name.toUpperCase() + ' FEIERT DICH');
    await expect(this.jurors[index].getByText(text, { exact: true })).toBeVisible();
  }
  async shouldExpireReactions() {
    await expect(this.projector!.getByRole('status')).toHaveCount(0);
    await expect(this.jurors[0].getByText('Sauber abgeliefert!', { exact: true })).toHaveCount(0);
  }
  async shouldCelebrateEverywhere() {
    await expect(this.projector!.getByText(/Das ist dein/)).toBeVisible();
    for (let index = 0; index < this.jurors.length; index++)
      await expect(this.jurors[index].getByText(['Sauber abgeliefert!', 'Volle Spannung!', 'Zugabe!'][index], { exact: true })).toBeVisible();
  }
  async shouldShowMotifsEverywhere() {
    for (const page of this.jurors)
      await expect(page.getByText('GEMEINSAM WIRD’S GROSS', { exact: true })).toBeVisible();
    await expect(this.projector!.getByText(/Das ist dein/)).toHaveCount(0);
  }
  async shouldWarnDisconnected() {
    await expect(this.projector!.getByRole('main').getByRole('alert')).toContainText('Verbindung unterbrochen');
  }
  async shouldReconnect() { await expect(this.projector!.getByRole('main').getByRole('alert')).toHaveCount(0); }
  async shouldHaveReadOnlyFittedScreens() {
    for (const page of [this.projector!, ...this.jurors]) {
      await expect(page.getByRole('main').getByRole('button')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const main = await page.getByRole('main').boundingBox();
      expect(main!.height).toBe(1090);
      const frame = await page.getByRole('main').locator(':scope > div').first().boundingBox();
      expect(frame!.width / frame!.height).toBeCloseTo(16 / 9, 1);
    }
  }
  async shouldRejectPublicCommands() {
    const guest = await this.control.context().browser()!.newContext();
    try {
      expect((await guest.request.post(new URL('/api/superstar/commands', this.control.url()).href, { data: { type: 'golden' } })).status()).toBe(401);
    } finally { await guest.close(); }
  }
  async shouldRejectUnknownJuror() {
    const response = await this.displays!.request.get(new URL('/superstar/jury/unknown', this.control.url()).href);
    expect(response.status()).toBe(404);
  }
  async shouldReportCommandFailure() {
    await this.control.route('**/api/superstar/commands', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }));
    await this.celebrate();
    await expect(this.control.getByRole('main').getByRole('alert')).toContainText('Befehl nicht bestätigt');
    await expect(this.projector!.getByText(/Das ist dein/)).toHaveCount(0);
  }
}
