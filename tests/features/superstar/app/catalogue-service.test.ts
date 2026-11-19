import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { CatalogueService, UnknownShow, type CatalogueStore } from '../../../../features/superstar/app/catalogue-service';
import { ShowService } from '../../../../features/superstar/app/show-service';
import { demoShows, type ShowDefinition } from '../../../../features/superstar/domain/show-catalogue';

let entries: ShowDefinition[];
let service: CatalogueService;
let show: ShowService;
let store: CatalogueStore;
let writes: unknown[];
beforeEach(() => {
  entries = structuredClone(demoShows);
  writes = [];
  store = {
    list: async () => entries,
    save: async data => { writes.push(data); return { ...data, _id: data._id ?? 'created' }; },
    asset: async id => ({ _id: id, path: '/image.png' }),
  };
  show = new ShowService({ now: () => 10, schedule: () => () => {} }, 'catalogue', []);
  service = new CatalogueService(store, show);
});

test('loading uses persisted shows instead of demo data, and can retry after an upstream failure', async () => {
  store.list = async () => { throw new Error('upstream'); };
  await assert.rejects(service.load());
  store.list = async () => [{ ...entries[0], _id: 'persisted', name: 'Persisted show' }];

  await service.load();

  assert.equal(show.snapshot().shows[0].name, 'Persisted show');
  assert.equal(show.snapshot().shows.length, 1);
});

test('creation allocates order and only confirmed saves reach the live catalogue', async () => {
  await service.load();
  await service.save({ name: 'New', title: 'Music', description: '', images: [] });

  assert.equal(show.snapshot().shows.at(-1)?.sortOrder, 6);
  assert.equal(show.snapshot().state.performerIndex, 0);
  assert.equal(writes.length, 1);

  store.save = async () => false;
  await assert.rejects(service.save({ name: 'No', title: 'Music', description: '', images: [] }));
  assert.equal(show.snapshot().shows.length, 7);
});

test('unknown IDs never create shows and image references are verified before saving', async () => {
  await assert.rejects(service.save(entries[0], 'unknown'), UnknownShow);
  await assert.rejects(service.save({ ...entries[0], images: [{ _id: 'asset', path: '/forged.png' }] }, entries[0]._id));
  assert.equal(writes.length, 0);
});

test('updated titles are broadcast, and a failed write leaves the active content unchanged', async () => {
  await service.load();
  const state = show.snapshot().state;
  await service.save({ ...entries[0], title: 'Updated', images: [{ _id: 'asset', path: '/image.png' }] }, entries[0]._id);

  assert.equal(show.snapshot().shows[0].title, 'Updated');
  assert.deepEqual(show.snapshot().state, state);

  store.save = async () => { throw new Error('failed'); };
  await assert.rejects(service.save({ ...entries[0], title: 'Failed' }, entries[0]._id));
  assert.equal(show.snapshot().shows[0].title, 'Updated');
});
