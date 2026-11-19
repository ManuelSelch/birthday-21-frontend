import { test } from '@playwright/test';
import { SuperstarLiveDriver } from './support/superstar-live-driver';

let show: SuperstarLiveDriver;
test.beforeEach(({ page }) => { show = new SuperstarLiveDriver(page); });
test.afterEach(() => show.dispose());

test('live controller requires login and the four outputs remain read-only', async () => {
  await show.openProtectedControl();
  await show.shouldRequireLogin();

  await show.prepareShow();
  await show.openScreens();

  await show.shouldHaveReadOnlyFittedScreens();
  await show.shouldRejectPublicCommands();
  await show.shouldRejectUnknownJuror();
});

test('controller synchronizes acts, scenes and jury reactions across separate browser sessions', async () => {
  await show.prepareShow();
  await show.openScreens();

  await show.selectAct('Danny');
  await show.shouldShowAct('Danny');
  await show.buzz('Manuel');
  await show.shouldShowReaction('Manuel', 0, 'Sauber abgeliefert!');
  await show.shouldExpireReactions();

  await show.buzz('Manuel');
  await show.shouldShowReaction('Manuel', 0, 'Sauber abgeliefert!');
  await show.disconnectScreens();
  await show.shouldWarnDisconnected();
  await show.shouldExpireReactions();
  await show.reconnectScreens();
  await show.shouldReconnect();
  await show.selectScene('Ergebnis');
  await show.shouldShowResults();
  await show.reloadProjector();
  await show.shouldShowResults();
});

test('golden moment and jury mode are shared; disconnected screens catch up automatically', async () => {
  await show.prepareShow();
  await show.openScreens();

  await show.celebrate();
  await show.shouldCelebrateEverywhere();
  await show.reset();
  await show.selectMotifs();
  await show.shouldShowMotifsEverywhere();

  await show.disconnectScreens();
  await show.shouldWarnDisconnected();
  await show.selectScene('Ergebnis');
  await show.reconnectScreens();
  await show.shouldReconnect();
  await show.shouldShowResults();
});

test('a failed command reports an error without optimistic celebration on the displays', async () => {
  await show.prepareShow();
  await show.openScreens();

  await show.shouldReportCommandFailure();
});
