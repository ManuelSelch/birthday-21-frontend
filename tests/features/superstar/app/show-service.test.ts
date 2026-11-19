import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { ShowService, type ShowClock } from '../../../../features/superstar/app/show-service';
import { parseSnapshot } from '../../../../features/superstar/domain/live-show';

class Clock implements ShowClock {
  time = 10000;
  tasks = new Set<{ at: number; callback: () => void }>();
  now = () => this.time;
  schedule = (callback: () => void, delay: number) => {
    const task = { at: this.time + delay, callback };
    this.tasks.add(task);
    return () => { this.tasks.delete(task); };
  };
  advance(milliseconds: number) {
    this.time += milliseconds;
    for (const task of [...this.tasks]) {
      if (task.at > this.time) continue;
      this.tasks.delete(task);
      task.callback();
    }
  }
}

let clock: Clock;
let show: ShowService;
beforeEach(() => {
  clock = new Clock();
  show = new ShowService(clock, 'test-session');
});
afterEach(() => show.dispose());

test('a new connection gets a complete snapshot and subsequent shared commands', () => {
  const received: string[] = [];
  const unsubscribe = show.subscribe(snapshot => received.push(snapshot.state.scene));

  show.command({ type: 'scene', scene: 'camera' });
  assert.deepEqual(received, ['act', 'camera']);
  assert.equal(show.snapshot().revision, 1);
  assert.ok(parseSnapshot(show.snapshot()));

  unsubscribe();
  show.command({ type: 'scene', scene: 'idle' });
  assert.deepEqual(received, ['act', 'camera']);
});

test('server expires each juror independently and repeated buzzers extend their lifetime', () => {
  show.command({ type: 'buzz', index: 0 });
  clock.advance(2000);
  show.command({ type: 'buzz', index: 1 });
  clock.advance(1200);

  assert.deepEqual(show.snapshot().state.active, [false, true, false]);
  assert.equal(show.snapshot().state.reaction, 1);

  const oldBurst = show.snapshot().state.burst;
  show.command({ type: 'buzz', index: 1 });
  clock.advance(2500);
  assert.equal(show.snapshot().state.burst, oldBurst + 1);
  assert.equal(show.snapshot().state.reaction, 1);
  clock.advance(700);
  assert.deepEqual(show.snapshot().state.active, [false, false, false]);
  assert.equal(show.snapshot().state.reaction, null);
});

test('reconnecting does not replay an expired reaction, even when a timer was delayed', () => {
  show.command({ type: 'buzz', index: 2 });
  clock.time += 5000;
  let reaction: number | null = 2;

  show.subscribe(snapshot => { reaction = snapshot.state.reaction; });

  assert.equal(reaction, null);
});

test('golden moment persists, reset cancels expiry work, and mode and act are shared', () => {
  show.command({ type: 'buzz', index: 0 });
  show.command({ type: 'golden' });
  clock.advance(10000);
  assert.equal(show.snapshot().state.celebrate, true);

  show.command({ type: 'reset' });
  assert.equal(show.snapshot().state.celebrate, false);
  assert.equal(clock.tasks.size, 0);

  show.command({ type: 'mode', mode: 'art' });
  show.command({ type: 'performer', index: 4 });
  assert.equal(show.snapshot().state.mode, 'art');
  assert.equal(show.snapshot().state.performerIndex, 4);
});

test('snapshots cannot be mutated by a subscriber and broken subscribers do not block others', () => {
  show.subscribe(snapshot => { snapshot.state.active[0] = true; });
  show.subscribe(() => { throw new Error('disconnected client'); });
  const revisions: number[] = [];
  show.subscribe(snapshot => revisions.push(snapshot.revision));

  show.command({ type: 'scene', scene: 'results' });

  assert.equal(show.snapshot().state.active[0], false);
  assert.deepEqual(revisions, [0, 1]);
});
