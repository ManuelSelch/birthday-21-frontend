import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { catalogueHandlers, uploadHandler } from '../../../../features/superstar/app/editor-http';
import { CatalogueService } from '../../../../features/superstar/app/catalogue-service';
import { ShowService } from '../../../../features/superstar/app/show-service';
import { demoShows } from '../../../../features/superstar/domain/show-catalogue';

let writes: number;
let handlers: ReturnType<typeof catalogueHandlers>;
let uploads: number;
let upload: ReturnType<typeof uploadHandler>;
const request = (body: string, headers: Record<string, string> = {}) =>
  new Request('https://party.test/api/superstar/shows', { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body });
beforeEach(() => {
  writes = 0; uploads = 0;
  const show = new ShowService({ now: () => 1, schedule: () => () => {} }, 'http');
  const catalogue = new CatalogueService({
    list: async () => demoShows,
    save: async data => { writes++; return { ...data, _id: data._id ?? 'new' }; },
    asset: async id => ({ _id: id, path: '/image.png' }),
  }, show);
  const authorize = (req: Request) => req.headers.get('x-test-session') ? undefined : Response.json({}, { status: 401 });
  handlers = catalogueHandlers({ authorize, catalogue });
  upload = uploadHandler({ authorize, configured: () => true, upload: async () => { uploads++; return { _id: 'asset', path: '/image.png' }; } });
});

test('catalogue reads and writes require authorization, and reject invalid origin, JSON and oversized streamed bodies', async () => {
  assert.equal((await handlers.GET(new Request('https://party.test/api/superstar/shows'))).status, 401);
  assert.equal((await handlers.POST(request('{}'))).status, 401);
  assert.equal((await handlers.POST(request('{}', { 'x-test-session': 'yes', origin: 'https://evil.test' }))).status, 403);
  assert.equal((await handlers.POST(request('{}', { 'x-test-session': 'yes', 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await handlers.POST(request('{', { 'x-test-session': 'yes' }))).status, 400);
  assert.equal((await handlers.POST(request(' '.repeat(32769), { 'x-test-session': 'yes' }))).status, 413);
  assert.equal(writes, 0);
});

test('creation ignores caller order, never creates unknown IDs and only reports confirmed upstream saves', async () => {
  const response = await handlers.POST(request(JSON.stringify({ ...demoShows[0], _id: undefined, sortOrder: 999 }), { 'x-test-session': 'yes' }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal((await response.json()).sortOrder, 6);
  assert.equal((await handlers.POST(request(JSON.stringify({ ...demoShows[0], _id: 'unknown' }), { 'x-test-session': 'yes' }))).status, 404);
  assert.equal(writes, 1);
});

test('uploads require authorization, reject fake images and accept a bounded PNG with a signature', async () => {
  assert.equal((await upload(request('{}'))).status, 401);
  const create = (type: string, bytes: Uint8Array) => {
    const form = new FormData();
    form.append('file', new Blob([bytes as BlobPart], { type }), 'image.png');
    return new Request('https://party.test/api/superstar/images', { method: 'POST', headers: { 'x-test-session': 'yes' }, body: form });
  };
  assert.equal((await upload(create('image/png', new TextEncoder().encode('<script>bad</script>')))).status, 400);
  assert.equal(uploads, 0);
  assert.equal((await upload(create('image/png', new Uint8Array([137,80,78,71,13,10,26,10])))).status, 200);
  assert.equal(uploads, 1);
});
