import { test } from '@playwright/test';
import { SuperstarDriver } from './support/superstar-driver';

let show: SuperstarDriver;
test.beforeEach(({ page }) => { show = new SuperstarDriver(page); });

for (const width of [375, 900, 1280]) {
  test(`Birthday 21 page fits ${width}px without mockup-only content`, async () => {
    await show.open(undefined, width);

    await show.shouldShowAct();
    await show.shouldMatchBirthdayLayout();
  });
}

test('all five scenes and performer selection work locally', async () => {
  await show.open();
  await show.selectPerformer('Danny');
  await show.shouldShowAct('Danny');

  await show.selectScene('Kamera');
  await show.shouldShowCamera();
  await show.selectScene('Abstimmung');
  await show.shouldShowVoting();
  await show.selectScene('Ergebnis');
  await show.shouldShowResults();
  await show.shouldKeepSceneOnReload();
  await show.selectScene('Showpause');
  await show.shouldShowPause();
});

test('individual jury reactions expire independently and repeated presses replay', async () => {
  await show.open('camera');
  await show.pauseTime();

  await show.buzz('Manuel');
  await show.advanceTime(2000);
  await show.buzz('Marco');
  await show.shouldShowReaction('Marco');
  await show.shouldShowJurorReaction('Manuel');
  await show.advanceTime(1200);
  await show.shouldShowNoJurorReaction('Manuel');
  await show.shouldShowJurorReaction('Marco');
  await show.buzz('Marco');
  await show.advanceTime(2500);
  await show.shouldShowJurorReaction('Marco');
  await show.advanceTime(700);
  await show.shouldShowNoJurorReaction('Marco');
  await show.shouldShowNoReaction();
  await show.shouldShowCamera();
});

test('golden moment persists until reset and projector-only mode can be exited', async () => {
  await show.open();
  await show.pauseTime();

  await show.celebrate();
  await show.advanceTime(10000);
  await show.shouldShowGoldenMoment();
  await show.shouldShowJurorReaction('David');
  await show.reset();
  await show.shouldShowNoGoldenMoment();
  await show.selectJuryMotifs();
  await show.shouldShowMotifs();
  await show.showOnlyProjector();
  await show.shouldShowOnlyProjector();
  await show.showControls();
  await show.shouldShowMotifs();
});

test('invalid scene query defaults safely to the act scene', async () => {
  await show.open('constructor');

  await show.shouldShowAct();
});
