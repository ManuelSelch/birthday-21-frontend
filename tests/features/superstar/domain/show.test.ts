import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialShow, parseScene, updateShow } from '../../../../features/superstar/domain/show';

test('only known scene query values are accepted', () => {
  assert.equal(parseScene('results'), 'results');
  for (const value of [undefined, 'constructor', 'toString', 'unknown', ['vote']])
    assert.equal(parseScene(value), 'act');
});

test('buzzers activate independently and the latest juror owns the projector overlay', () => {
  let state = updateShow(initialShow(), { type: 'buzz', index: 0 });
  state = updateShow(state, { type: 'buzz', index: 1 });

  assert.deepEqual(state.active, [true, true, false]);
  assert.equal(state.reaction, 1);
  assert.equal(state.burst, 2);

  state = updateShow(state, { type: 'expire', index: 0 });
  assert.deepEqual(state.active, [false, true, false]);
  assert.equal(state.reaction, 1);
});

test('repeated buzzers replay, and clearing an overlay leaves the underlying scene intact', () => {
  let state = updateShow(initialShow('camera'), { type: 'buzz', index: 2 });
  state = updateShow(state, { type: 'buzz', index: 2 });
  state = updateShow(state, { type: 'clear-reaction' });

  assert.equal(state.burst, 2);
  assert.equal(state.reaction, null);
  assert.equal(state.scene, 'camera');
});

test('golden moment persists across juror expiry until reset', () => {
  let state = updateShow(initialShow(), { type: 'golden' });
  state = updateShow(state, { type: 'expire', index: 0 });

  assert.equal(state.celebrate, true);
  assert.equal(state.reaction, null);

  state = updateShow(state, { type: 'reset' });
  assert.equal(state.celebrate, false);
  assert.deepEqual(state.active, [false, false, false]);
});

test('changing scene or performer clears celebration and overlays', () => {
  const buzzing = updateShow(initialShow(), { type: 'buzz', index: 1 });
  const scene = updateShow(buzzing, { type: 'scene', scene: 'results' });
  assert.equal(scene.scene, 'results');
  assert.equal(scene.reaction, null);

  const golden = updateShow(buzzing, { type: 'golden' });
  const performer = updateShow(golden, { type: 'performer', index: 3 });
  assert.equal(performer.performerIndex, 3);
  assert.equal(performer.celebrate, false);
  assert.equal(performer.reaction, null);
  assert.deepEqual(performer.active, [false, false, false]);
});

test('jury idle mode and projector-only mode are independent of the selected scene', () => {
  let state = updateShow(initialShow('vote'), { type: 'mode', mode: 'art' });
  state = updateShow(state, { type: 'solo', solo: true });

  assert.equal(state.mode, 'art');
  assert.equal(state.solo, true);
  assert.equal(state.scene, 'vote');
});
