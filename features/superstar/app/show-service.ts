import { initialShow, reactionDuration, updateShow } from '../domain/show';
import { visibleShow, type ShowCommand, type ShowSnapshot } from '../domain/live-show';

export interface ShowClock {
  now: () => number;
  schedule: (callback: () => void, delay: number) => () => void;
}

type Listener = (snapshot: ShowSnapshot) => void;

export class ShowService {
  private current: ShowSnapshot;
  private listeners = new Set<Listener>();
  private cancelExpiry?: () => void;

  constructor(private readonly clock: ShowClock, sessionId: string) {
    this.current = { sessionId, revision: 0, serverTime: clock.now(), state: initialShow(),
      juryExpiresAt: [null, null, null], reactionExpiresAt: null };
  }

  snapshot(): ShowSnapshot {
    this.expire();
    return this.copy();
  }

  command(command: ShowCommand): ShowSnapshot {
    this.expire();
    this.current.state = updateShow(this.current.state, command);
    const now = this.clock.now();
    if (command.type === 'buzz') {
      this.current.juryExpiresAt[command.index] = now + reactionDuration;
      this.current.reactionExpiresAt = now + reactionDuration;
    }
    if (command.type === 'reset' || command.type === 'performer')
      this.current.juryExpiresAt = [null, null, null];
    if (command.type !== 'buzz' && command.type !== 'mode') this.current.reactionExpiresAt = null;
    this.current.revision++;
    this.scheduleExpiry();
    this.publish();
    return this.copy();
  }

  subscribe(listener: Listener): () => void {
    this.expire();
    this.listeners.add(listener);
    this.deliver(listener);
    return () => { this.listeners.delete(listener); };
  }

  dispose() {
    this.cancelExpiry?.();
    this.listeners.clear();
  }

  private copy(): ShowSnapshot {
    return structuredClone({ ...this.current, serverTime: this.clock.now() });
  }

  private expire() {
    const now = this.clock.now();
    const deadlines = [...this.current.juryExpiresAt, this.current.reactionExpiresAt];
    if (!deadlines.some(deadline => deadline !== null && deadline <= now)) return;
    this.current.state = visibleShow(this.current, now);
    this.current.juryExpiresAt = this.current.juryExpiresAt.map(deadline => deadline !== null && deadline > now ? deadline : null);
    if (this.current.reactionExpiresAt !== null && this.current.reactionExpiresAt <= now)
      this.current.reactionExpiresAt = null;
    this.current.revision++;
    this.scheduleExpiry();
    this.publish();
  }

  private scheduleExpiry() {
    this.cancelExpiry?.();
    const deadlines = [...this.current.juryExpiresAt, this.current.reactionExpiresAt]
      .filter((deadline): deadline is number => deadline !== null);
    this.cancelExpiry = deadlines.length
      ? this.clock.schedule(() => this.expire(), Math.max(0, Math.min(...deadlines) - this.clock.now()))
      : undefined;
  }

  private deliver(listener: Listener) {
    try { listener(this.copy()); }
    catch { this.listeners.delete(listener); }
  }

  private publish() {
    for (const listener of this.listeners) this.deliver(listener);
  }
}
