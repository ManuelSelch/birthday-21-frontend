import { afterEach, beforeEach, test } from 'node:test';
import { SuperstarServerDriver } from './support/superstar-driver';

let party: SuperstarServerDriver;
beforeEach(() => { party = new SuperstarServerDriver(); });
afterEach(() => party.dispose());

test('show commands require a valid admin session before changing state', async () => {
  await party.send({ type: 'golden' });

  party.shouldRespond(401);
  party.shouldRemainUnchanged();
});

test('controller commands broadcast complete snapshots to every connected screen', async () => {
  await party.login();
  const projector = party.connect();
  const juror = party.connect();
  await party.shouldReceive(projector, { scene: 'act' });
  await party.shouldReceive(juror, { scene: 'act' });

  await party.send({ type: 'scene', scene: 'camera' });

  party.shouldRespond(200);
  await party.shouldReceive(projector, { scene: 'camera' });
  await party.shouldReceive(juror, { scene: 'camera' });
  await party.disconnect(projector);

  const reconnected = party.connect();
  await party.shouldReceive(reconnected, { scene: 'camera' });
});

test('repeated buzzers get fresh events and reset clears all reactions', async () => {
  await party.login();
  const screen = party.connect();
  await party.shouldReceive(screen, { burst: 0 });

  await party.send({ type: 'buzz', index: 1 });
  await party.shouldReceive(screen, { reaction: 1, burst: 1 });
  await party.send({ type: 'buzz', index: 1 });
  await party.shouldReceive(screen, { reaction: 1, burst: 2 });
  await party.send({ type: 'golden' });
  await party.shouldReceive(screen, { reaction: null, celebrate: true, burst: 3 });
  await party.send({ type: 'reset' });
  await party.shouldReceive(screen, { reaction: null, celebrate: false, active: [false, false, false] });
});

test('invalid commands, internal actions and bad JSON cannot change show state', async () => {
  await party.login();
  for (const command of [{ type: 'expire', index: 0 }, { type: 'performer', index: 99 }, { type: 'scene', scene: 'constructor' }, null]) {
    await party.send(command);
    party.shouldRespond(400);
  }
  await party.send('{', { raw: true });
  party.shouldRespond(400);
  party.shouldRemainUnchanged();
});

test('cross-origin, non-JSON and oversized commands are rejected', async () => {
  await party.login();
  await party.send({ type: 'golden' }, { origin: 'http://other.test' });
  party.shouldRespond(403);
  await party.send({ type: 'golden' }, { contentType: 'text/plain' });
  party.shouldRespond(415);
  await party.send('x'.repeat(2049), { raw: true });
  party.shouldRespond(413);
  party.shouldRemainUnchanged();
});
