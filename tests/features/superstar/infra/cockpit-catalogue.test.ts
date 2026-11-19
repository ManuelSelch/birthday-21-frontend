import { afterEach, beforeEach, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { CockpitCatalogue } from '../../../../features/superstar/infra/cockpit-catalogue';
import { demoShows } from '../../../../features/superstar/domain/show-catalogue';

let store: CockpitCatalogue;
let requests: Array<{ url: string; options: RequestInit }>;
let respond: (url: string, options: RequestInit) => Response;
beforeEach(() => {
  requests = [];
  respond = () => Response.json(demoShows);
  store = new CockpitCatalogue(() => ({ base: 'https://cms.test/api', key: 'server-secret', uploadPath: '/superstar-upload' }));
  mock.method(globalThis, 'fetch', async (url: string | URL | Request, options: RequestInit = {}) => {
    requests.push({ url: String(url), options });
    return respond(String(url), options);
  });
});
afterEach(() => mock.restoreAll());

test('CMS reads and writes use server credentials, no cache, bounded requests and no credentialed redirects', async () => {
  assert.deepEqual(await store.list(), demoShows);
  respond = () => Response.json(demoShows[0]);
  await store.save(demoShows[0]);

  assert.equal(requests[0].url, 'https://cms.test/api/content/items/superstarShows');
  for (const request of requests) {
    assert.equal(new Headers(request.options.headers).get('api-key'), 'server-secret');
    assert.equal(request.options.redirect, 'error');
    assert.equal(request.options.cache, 'no-store');
    assert.ok(request.options.signal);
    assert.ok(!request.url.includes('server-secret'));
  }
  assert.deepEqual(JSON.parse(requests[1].options.body as string), { data: demoShows[0] });
});

test('uploads use the configured endpoint and verify returned image metadata', async () => {
  const asset = { _id: 'asset-1', path: '/image.png', mime: 'image/png' };
  respond = url => Response.json(url.endsWith('/superstar-upload') ? { failed: [], assets: [asset] } : asset);
  assert.deepEqual(await store.upload(new File(['image'], 'photo.png', { type: 'image/png' })), { _id: asset._id, path: asset.path });

  const form = requests[0].options.body as FormData;
  assert.ok(form.get('files[]') instanceof File);
  assert.equal(new Headers(requests[0].options.headers).has('Content-Type'), false);
  assert.equal(requests[1].url, 'https://cms.test/api/assets/asset-1');

  respond = () => Response.json({ failed: ['photo.png'], assets: [] });
  await assert.rejects(store.upload(new File(['image'], 'photo.png')));
});

test('missing upload configuration never attempts a guessed endpoint and image proxy rejects non-image data', async () => {
  const unconfigured = new CockpitCatalogue(() => ({ base: 'https://cms.test/api', key: 'server-secret' }));
  await assert.rejects(unconfigured.upload(new File([], 'image.png')));
  assert.equal(requests.length, 0);

  respond = () => Response.json({ error: 'not an image' });
  await assert.rejects(store.image('asset-1'));
  respond = () => new Response(new Uint8Array([1,2,3]), { headers: { 'content-type': 'image/png' } });
  const image = await store.image('asset-1');
  assert.equal(image.headers.get('content-type'), 'image/png');
  assert.equal(image.headers.get('cache-control'), 'private, no-store');
  assert.equal(image.headers.has('api-key'), false);
});
