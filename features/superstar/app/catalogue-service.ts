import { parseDefinition, parseCatalogue, parseImage, type ShowDefinition, type ShowDraft, type ShowImage } from '../domain/show-catalogue';
import type { ShowService } from './show-service';

export interface CatalogueStore {
  list(): Promise<unknown>;
  save(data: Omit<ShowDefinition, '_id'> & { _id?: string }): Promise<unknown>;
  asset(id: string): Promise<ShowImage & Record<string, unknown>>;
}
export class UnknownShow extends Error {}

export class CatalogueService {
  private loading?: Promise<void>;
  private ready = false;
  private queue: Promise<unknown> = Promise.resolve();
  constructor(private readonly store: CatalogueStore, private readonly show: ShowService) {}

  async load(): Promise<ShowService> {
    if (!this.ready) {
      this.loading ??= this.store.list().then(value => {
        const entries = parseCatalogue(value);
        if (!entries) throw new Error('Invalid catalogue');
        entries.sort((a, b) => a.sortOrder - b.sortOrder || a._id.localeCompare(b._id));
        this.show.replaceCatalogue(entries);
        this.ready = true;
      }).finally(() => { this.loading = undefined; });
      await this.loading;
    }
    return this.show;
  }

  save(draft: ShowDraft, id?: string): Promise<ShowDefinition> {
    const operation = this.queue.then(async () => {
      await this.load();
      const shows = this.show.snapshot().shows;
      const previous = id ? shows.find(show => show._id === id) : undefined;
      if (id && !previous) throw new UnknownShow();
      if (!previous && shows.length >= 200) throw new Error('Catalogue full');
      const images = await Promise.all(draft.images.map(image => this.store.asset(image._id)));
      if (images.some((image, i) => image.path !== draft.images[i].path)) throw new Error('Invalid asset');
      const data = { ...draft, images, sortOrder: previous?.sortOrder ?? Math.max(-1, ...shows.map(show => show.sortOrder)) + 1,
        ...(id ? { _id: id } : {}) };
      const saved = parseDefinition(await this.store.save(data));
      if (!saved || (id && saved._id !== id) ||
        (!id && shows.some(show => show._id === saved._id)) ||
        saved.name !== data.name || saved.title !== data.title || saved.description !== data.description ||
        saved.sortOrder !== data.sortOrder || JSON.stringify(saved.images) !== JSON.stringify(data.images.map(parseImage)))
        throw new Error('Save not confirmed');
      this.show.replaceCatalogue(previous ? shows.map(show => show._id === id ? saved : show) : [...shows, saved]);
      return saved;
    });
    this.queue = operation.catch(() => {});
    return operation;
  }
}
