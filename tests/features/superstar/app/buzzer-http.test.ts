import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buzzerHandler } from '../../../../features/superstar/app/buzzer-http';

test('authentication and path validation happen before accessing the catalogue', async () => {
  let loads = 0;
  const handle = buzzerHandler({
    key: () => 'device-secret',
    show: () => { loads++; throw new Error('private upstream failure'); },
  });
  for (const authorization of ['', 'Basic device-secret', 'Bearer wrong', 'Bearer device-secret extra']) {
    const response = await handle(new Request('https://party.test', {
      method: 'POST', headers: { Authorization: authorization },
    }), 'manuel');
    assert.equal(response.status, 401);
  }
  const unknown = await handle(new Request('https://party.test', {
    method: 'POST', headers: { Authorization: 'Bearer device-secret' },
  }), 'unknown');
  assert.equal(unknown.status, 404);
  assert.equal(loads, 0);
});

test('catalogue failures return a private non-success response', async () => {
  const handle = buzzerHandler({
    key: () => 'device-secret',
    show: () => { throw new Error('private upstream failure'); },
  });

  const response = await handle(new Request('https://party.test', {
    method: 'POST', headers: { Authorization: 'Bearer device-secret' },
  }), 'manuel');

  assert.equal(response.status, 502);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.doesNotMatch(await response.text(), /private upstream failure|device-secret/);
});
