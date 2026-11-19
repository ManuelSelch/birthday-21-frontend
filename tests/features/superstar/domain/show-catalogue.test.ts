import { test } from 'node:test';
import assert from 'node:assert/strict';
import { demoShows, parseCatalogue, parseDraft, parseImage } from '../../../../features/superstar/domain/show-catalogue';
import { parseCommand, parseSnapshot } from '../../../../features/superstar/domain/live-show';
import { ShowService } from '../../../../features/superstar/app/show-service';

test('show drafts trim required text and allow empty descriptions and image arrays', () => {
  assert.deepEqual(parseDraft({ name: '  New act ', title: ' Music ', description: '', images: [], _id: 'ignored', sortOrder: 999 }), {
    name: 'New act', title: 'Music', description: '', images: [],
  });
});

test('malformed catalogues, single-image objects, duplicate IDs and unsafe image references are rejected', () => {
  const image = { _id: 'asset-1', path: '/photo.png' };
  for (const value of [
    { ...demoShows[0], name: ' ' }, { ...demoShows[0], title: '' },
    { ...demoShows[0], description: null }, { ...demoShows[0], images: image },
    { ...demoShows[0], images: [image, image] }, { ...demoShows[0], images: new Array(21).fill(image) },
  ]) assert.equal(parseDraft(value), null);
  assert.equal(parseCatalogue([demoShows[0], demoShows[0]]), null);
  assert.equal(parseCatalogue([{ ...demoShows[0], sortOrder: -1 }]), null);
  for (const path of ['https://evil.test/image', '//evil.test/image', '/bad\\path', '/bad\npath'])
    assert.equal(parseImage({ ...image, path }), null);
});

test('live commands validate added shows and image indexes against the actual catalogue', () => {
  const shows = [...demoShows, { ...demoShows[0], _id: 'added', images: [{ _id: 'asset-1', path: '/1.png' }, { _id: 'asset-2', path: '/2.png' }] }];
  assert.deepEqual(parseCommand({ type: 'performer', index: 6 }, shows), { type: 'performer', index: 6 });
  assert.deepEqual(parseCommand({ type: 'image', index: 1 }, shows, 6), { type: 'image', index: 1 });
  assert.equal(parseCommand({ type: 'image', index: 2 }, shows, 6), null);
  assert.equal(parseCommand({ type: 'image', index: 0 }, shows, 0), null);
  assert.equal(parseCommand({ type: 'performer', index: 7 }, shows), null);
});

test('empty catalogues and replacing the selected image retain valid live snapshots', () => {
  const show = new ShowService({ now: () => 1, schedule: () => () => {} }, 'catalogue', []);
  assert.ok(parseSnapshot(show.snapshot()));
  show.replaceCatalogue([{ ...demoShows[0], images: [{ _id: 'one', path: '/one.png' }, { _id: 'two', path: '/two.png' }] }]);
  show.command({ type: 'buzz', index: 0 });
  show.command({ type: 'image', index: 1 });
  assert.equal(show.snapshot().reactionExpiresAt, 3201);
  assert.equal(show.snapshot().state.reaction, 0);
  show.replaceCatalogue([{ ...demoShows[0], images: [{ _id: 'two', path: '/two.png' }] }]);
  assert.equal(show.snapshot().state.imageIndex, 0);
  assert.ok(parseSnapshot(show.snapshot()));
  show.dispose();
});
