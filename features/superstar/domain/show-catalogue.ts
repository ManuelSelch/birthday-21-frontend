import { acts } from './catalog';

export interface ShowImage { _id: string; path: string }
export interface ShowDefinition {
  _id: string;
  name: string;
  title: string;
  description: string;
  sortOrder: number;
  images: ShowImage[];
}
export type ShowDraft = Omit<ShowDefinition, '_id' | 'sortOrder'>;
export const maxImages = 20;
export const maxImageBytes = 10 * 1024 * 1024;
export const validId = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export function parseImage(value: unknown): ShowImage | null {
  if (!record(value) || !validId(value._id) || typeof value.path !== 'string' ||
    !value.path.startsWith('/') || value.path.startsWith('//') || value.path.length > 1000 ||
    /[\\\u0000-\u001f]/.test(value.path)) return null;
  return { _id: value._id, path: value.path };
}

export function parseDraft(value: unknown): ShowDraft | null {
  if (!record(value) || typeof value.name !== 'string' || !value.name.trim() || value.name.trim().length > 100 ||
    typeof value.title !== 'string' || !value.title.trim() || value.title.trim().length > 160 ||
    typeof value.description !== 'string' || value.description.length > 500 ||
    !Array.isArray(value.images) || value.images.length > maxImages) return null;
  const images = value.images.map(parseImage);
  if (images.some(image => !image) || new Set(images.map(image => image!._id)).size !== images.length) return null;
  return { name: value.name.trim(), title: value.title.trim(), description: value.description, images: images as ShowImage[] };
}

export function parseDefinition(value: unknown): ShowDefinition | null {
  const draft = parseDraft(value);
  if (!draft || !record(value) || !validId(value._id) ||
    !Number.isSafeInteger(value.sortOrder) || (value.sortOrder as number) < 0) return null;
  return { ...draft, _id: value._id, sortOrder: value.sortOrder as number };
}

export function parseCatalogue(value: unknown): ShowDefinition[] | null {
  if (!Array.isArray(value) || value.length > 200) return null;
  const shows = value.map(parseDefinition);
  if (shows.some(show => !show) || new Set(shows.map(show => show!._id)).size !== shows.length) return null;
  return shows as ShowDefinition[];
}

// Only the independent local demo and test fixtures use the original hard-coded acts.
export const demoShows: ShowDefinition[] = acts.map((act, index) => ({
  _id: 'demo-' + index, name: act.name, title: act.act,
  description: 'Talent optional. Legendenstatus garantiert.', sortOrder: index, images: [],
}));
export const imageUrl = (image: ShowImage) => '/api/superstar/images/' + encodeURIComponent(image._id);
