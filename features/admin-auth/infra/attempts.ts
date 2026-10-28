const WINDOW_SECONDS = 15 * 60;
const MAX_ATTEMPTS = 10;

export class AttemptLimiter {
  private started = 0;
  private count = 0;

  consume(now: number): number {
    if (this.count === 0 || now >= this.started + WINDOW_SECONDS || now < this.started) {
      this.started = now;
      this.count = 0;
    }
    if (this.count >= MAX_ATTEMPTS) return Math.max(1, this.started + WINDOW_SECONDS - now);
    this.count += 1;
    return 0;
  }
}

// Keep the single-process budget across Next development module reloads.
const processState = globalThis as typeof globalThis & { birthdayAdminLimiter?: AttemptLimiter };
export const loginAttempts = processState.birthdayAdminLimiter ??= new AttemptLimiter();
