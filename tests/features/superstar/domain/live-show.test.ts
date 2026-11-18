import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCommand, parseSnapshot } from '../../../../features/superstar/domain/live-show';

 test('only public show commands and valid catalog values are accepted', () => {
  for (const command of [
    { type: 'scene', scene: 'camera' }, { type: 'performer', index: 5 },
    { type: 'buzz', index: 2 }, { type: 'golden' }, { type: 'reset' }, { type: 'mode', mode: 'art' },
  ]) assert.deepEqual(parseCommand(command), command);

  for (const command of [
    null, [], {}, { type: 'scene', scene: 'constructor' }, { type: 'buzz', index: -1 },
    { type: 'buzz', index: 3 }, { type: 'performer', index: 6 }, { type: 'performer', index: 1.5 },
    { type: 'performer', index: '1' }, { type: 'expire', index: 0 }, { type: 'clear-reaction' },
    { type: 'solo', solo: true }, { type: 'mode', mode: 'unknown' }, { type: 'reset', scene: 'idle' },
  ]) assert.equal(parseCommand(command), null, JSON.stringify(command));
});

test('malformed event payloads are rejected before reaching display components', () => {
  for (const value of [null, [], {}, { state: { scene: 'act' } }])
    assert.equal(parseSnapshot(value), null);
});
