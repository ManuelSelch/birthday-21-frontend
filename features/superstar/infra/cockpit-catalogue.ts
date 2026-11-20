import { parseImage, type ShowDefinition, type ShowImage } from '../domain/show-catalogue';
import type { CatalogueStore } from '../app/catalogue-service';

export class CockpitCatalogue implements CatalogueStore {
  constructor(private readonly environment: () => { base?: string; key?: string; uploadPath?: string; uploadFolder?: string } = () => ({
    base: process.env.COCKPIT_API_URL, key: process.env.COCKPIT_API_KEY,
    uploadPath: process.env.COCKPIT_ASSET_UPLOAD_PATH, uploadFolder: process.env.COCKPIT_ASSET_UPLOAD_FOLDER,
  })) {}

  private async request(path: string, options: RequestInit = {}) {
    const { base, key } = this.environment();
    if (!base || !key) throw new Error('Cockpit not configured');
    const response = await fetch(base.replace(/\/$/, '') + path, {
      ...options, redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(20000),
      headers: { 'api-key': key, ...options.headers },
    });
    if (!response.ok) throw new Error('Cockpit request failed');
    return response;
  }

  async list(): Promise<unknown> {
    return (await this.request('/content/items/superstarShows')).json();
  }
  async save(data: Omit<ShowDefinition, '_id'> & { _id?: string }): Promise<unknown> {
    return (await this.request('/content/item/superstarShows', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data }),
    })).json();
  }
  async asset(id: string): Promise<ShowImage & Record<string, unknown>> {
    const value = await (await this.request('/assets/' + encodeURIComponent(id))).json();
    const image = parseImage(value);
    if (!image || image._id !== id || !['image/jpeg', 'image/png', 'image/webp'].includes(value.mime)) throw new Error('Invalid image');
    return { ...value, ...image };
  }
  uploadConfigured() {
    const { uploadPath: path, uploadFolder: folder } = this.environment();
    return Boolean(path && /^\/[a-zA-Z0-9_/-]+$/.test(path) && !path.includes('//') && !path.includes('..') &&
      folder && /^[a-zA-Z0-9_-]+$/.test(folder));
  }
  async upload(file: File): Promise<ShowImage> {
    if (!this.uploadConfigured()) throw new Error('Upload endpoint not configured');
    const form = new FormData();
    form.append('file', file, file.name.replace(/[^a-zA-Z0-9._-]/g, '_'));
    form.append('folder', this.environment().uploadFolder!);
    const value = await (await this.request(this.environment().uploadPath!, { method: 'POST', body: form })).json();
    // The image upload addon returns a native asset, including for deduplicated uploads.
    const image = parseImage(value?.asset);
    if (!image) throw new Error('Invalid uploaded asset');
    return parseImage(await this.asset(image._id))!;
  }
  async image(id: string) {
    const response = await this.request('/assets/image/' + encodeURIComponent(id) + '?o=1&w=1920&h=1920&m=bestFit');
    const type = response.headers.get('content-type')?.split(';')[0];
    if (!type || !['image/jpeg', 'image/png', 'image/webp'].includes(type)) throw new Error('Invalid image response');
    return new Response(response.body, { headers: {
      'Content-Type': type, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff',
    } });
  }
}
