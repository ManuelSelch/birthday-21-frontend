import 'server-only';
import { ShowService } from './app/show-service';
import { CatalogueService } from './app/catalogue-service';
import { CockpitCatalogue } from './infra/cockpit-catalogue';

// Both route bundles share one runtime in this persistent Node.js process.
const processState = globalThis as typeof globalThis & { birthdaySuperstarRuntime?: {
  show: ShowService; catalogue: CatalogueService; store: CockpitCatalogue;
} };

export function superstarRuntime() {
  if (!processState.birthdaySuperstarRuntime) {
    const show = new ShowService({
      now: () => Date.now(),
      schedule: (callback, delay) => {
        const timer = setTimeout(callback, delay);
        timer.unref();
        return () => clearTimeout(timer);
      },
    }, crypto.randomUUID(), []);
    const store = new CockpitCatalogue();
    processState.birthdaySuperstarRuntime = { show, store, catalogue: new CatalogueService(store, show) };
  }
  return processState.birthdaySuperstarRuntime;
}
export const showService = () => superstarRuntime().catalogue.load();
