import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eventHandler } from '../../../../features/superstar/app/http';
import { ShowService } from '../../../../features/superstar/app/show-service';

test('cancelling an SSE response unsubscribes and prevents further deliveries', async context => {
  const show = new ShowService({ now: () => 1000, schedule: () => () => {} }, 'stream-test');
  context.after(() => show.dispose());
  const original = show.subscribe.bind(show);
  let subscribed = 0;
  context.mock.method(show, 'subscribe', (listener: Parameters<ShowService['subscribe']>[0]) => {
    subscribed++;
    const unsubscribe = original(listener);
    return () => { subscribed--; unsubscribe(); };
  });
  const response = eventHandler(() => show)(new Request('http://party.test/events'));
  const reader = response.body!.getReader();
  assert.equal(subscribed, 1);

  await reader.cancel();
  show.command({ type: 'golden' });

  assert.equal(subscribed, 0);
  assert.equal((await reader.read()).done, true);
});

test('aborting the HTTP request closes its event stream and removes its subscription', async context => {
  const show = new ShowService({ now: () => 1000, schedule: () => () => {} }, 'abort-test');
  context.after(() => show.dispose());
  const abort = new AbortController();
  const response = eventHandler(() => show)(new Request('http://party.test/events', { signal: abort.signal }));
  const reader = response.body!.getReader();

  abort.abort();

  while (!(await reader.read()).done) { /* Drain frames queued before abort. */ }
  show.command({ type: 'reset' });
  assert.equal((await reader.read()).done, true);
});

test('a stalled SSE consumer is disconnected instead of retaining an unbounded event queue', async context => {
  const show = new ShowService({ now: () => 1000, schedule: () => () => {} }, 'slow-test');
  context.after(() => show.dispose());
  const response = eventHandler(() => show)(new Request('http://party.test/events'));

  for (let index = 0; index < 100; index++) show.command({ type: 'golden' });

  const reader = response.body!.getReader();
  let frames = 0;
  while (!(await reader.read()).done) frames++;
  assert.ok(frames <= 16);
});
