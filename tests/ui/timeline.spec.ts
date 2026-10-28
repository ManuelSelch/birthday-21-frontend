import { test } from "@playwright/test";
import { TimelineDriver } from "./support/timeline-driver";

for (const width of [320, 375, 768, 1280]) {
  test(`public programme fits ${width}px and shows a static chronological schedule`, async ({ page }) => {
    const timeline = new TimelineDriver(page);
    await timeline.reset();
    await timeline.useViewport(width);
    await timeline.useExampleSchedule();

    await timeline.open();

    await timeline.thenProgrammeIsVisible();
    await timeline.thenNoReturnLink();
    await timeline.thenLayoutFits();
  });
}

test("invitation programme link retains the personal invitation without requiring RSVP", async ({ page }) => {
  const timeline = new TimelineDriver(page);
  await timeline.reset();
  await timeline.useExampleSchedule();

  await timeline.openFromInvitation();

  await timeline.thenPersonalReturnLink();
  await timeline.thenProgrammeIsVisible();
  await timeline.returnToInvitation();
  await timeline.thenInvitationIsPreserved();
});

test("empty programme has an honest placeholder, not mockup events", async ({ page }) => {
  const timeline = new TimelineDriver(page);
  await timeline.reset();
  await timeline.setSchedule([]);

  await timeline.open();

  await timeline.thenEmpty();
});

test("upstream and malformed data failures show a safe unavailable state", async ({ page }) => {
  const timeline = new TimelineDriver(page);
  await timeline.reset();
  await timeline.setSchedule([], true);

  await timeline.open();

  await timeline.thenUnavailable();
  await timeline.setSchedule([{ title: "Broken event", start: "invalid" }]);
  await timeline.open();
  await timeline.thenUnavailable();
});
