import { afterEach, beforeEach, test } from 'node:test';
import { SuperstarServerDriver } from './support/superstar-driver';

let party: SuperstarServerDriver;
beforeEach(() => {
  party = new SuperstarServerDriver();
  party.configureBuzzerKey('dedicated-device-key');
});
afterEach(() => party.dispose());

test('device key triggers every named juror and broadcasts repeated presses without a session', async () => {
  const screen = party.connect();
  await party.shouldReceive(screen, { burst: 0 });

  for (const [index, name] of ['manuel', 'marco', 'david'].entries()) {
    await party.buzz(name, 'dedicated-device-key');

    party.shouldRespond(200);
    await party.shouldReceive(screen, { reaction: index, burst: index + 1 });
  }
  await party.buzz('david', 'dedicated-device-key');

  party.shouldRespond(200);
  await party.shouldReceive(screen, { reaction: 2, burst: 4, active: [true, true, true] });
});

test('missing or wrong device keys cannot buzz, even with an admin session', async () => {
  await party.login();
  for (const key of [undefined, '', 'incorrect-key']) {
    await party.buzz('manuel', key);

    party.shouldRespond(401);
    party.shouldRemainUnchanged();
  }
});

test('unconfigured or empty device key fails closed', async () => {
  for (const key of [undefined, '']) {
    party.configureBuzzerKey(key);
    await party.buzz('manuel', 'dedicated-device-key');

    party.shouldRespond(503);
    party.shouldRemainUnchanged();
  }
});

test('device key accepts only known juror paths and never grants admin command access', async () => {
  for (const name of ['unknown', 'constructor', 'golden', 'Manuel']) {
    await party.buzz(name, 'dedicated-device-key');

    party.shouldRespond(404);
    party.shouldRemainUnchanged();
  }
  await party.send({ type: 'golden' }, { apiKey: 'dedicated-device-key' });
  party.shouldRespond(401);
  party.shouldRemainUnchanged();
});

test('rotating the device key immediately rejects the old key', async () => {
  party.configureBuzzerKey('replacement-key');
  await party.buzz('manuel', 'dedicated-device-key');
  party.shouldRespond(401);
  party.shouldRemainUnchanged();

  await party.buzz('manuel', 'replacement-key');
  party.shouldRespond(200);
});
