import { test } from '@playwright/test';
import { SuperstarEditorDriver } from './support/superstar-editor-driver';

let editor: SuperstarEditorDriver;
test.beforeEach(({ page }) => { editor = new SuperstarEditorDriver(page); });
test.afterEach(() => editor.dispose());

test('create, preview and save a show without switching the running act; select its content and images live', async () => {
  await editor.open();
  await editor.add('Editor Test Act');
  await editor.shouldPreview('Neuer Titel');
  await editor.uploadTwoImages();
  await editor.shouldPreviewSecondImage();
  await editor.save();
  await editor.setTitle('Aktualisierter Titel');
  await editor.save();
  await editor.returnToControl();
  await editor.shouldKeepActiveAct();
  await editor.openProjector();

  await editor.selectAct('Editor Test Act');
  await editor.shouldShowLiveContent('Editor Test Act', 'Aktualisierter Titel');
  await editor.selectSecondLiveImage();
  await editor.reload();
  await editor.shouldShowLiveContent('Editor Test Act', 'Aktualisierter Titel');
});

test('failed saves retain the draft, unsaved navigation is guarded, and discard restores saved content', async () => {
  await editor.open();
  await editor.add('Editor Failure Act');
  await editor.save();

  await editor.setTitle('Nicht gespeichert');
  await editor.shouldKeepDraftAfterFailure();
  await editor.shouldGuardNavigation();
  await editor.discard();
  await editor.shouldHaveTitle('Neuer Titel');
  await editor.shouldFitMobile();
});

test('uploaded images can be removed from a draft without deleting the asset', async () => {
  await editor.open();
  await editor.add('Editor Images Act');
  await editor.uploadTwoImages();
  await editor.removeSecondImage();
  await editor.save();
  await editor.returnToControl();
  await editor.selectAct('Editor Images Act');
  await editor.shouldShowLiveContent('Editor Images Act', 'Neuer Titel');
});
