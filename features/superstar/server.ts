import 'server-only';
import { ShowService } from './app/show-service';

// Both route bundles share one service in this persistent Node.js process.
const processState = globalThis as typeof globalThis & { birthdaySuperstar?: ShowService };

export function showService(): ShowService {
  processState.birthdaySuperstar ??= new ShowService({
    now: () => Date.now(),
    schedule: (callback, delay) => {
      const timer = setTimeout(callback, delay);
      timer.unref();
      return () => clearTimeout(timer);
    },
  }, crypto.randomUUID());
  return processState.birthdaySuperstar;
}
