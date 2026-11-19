import { maxImageBytes, parseDraft, validId, type ShowImage } from '../domain/show-catalogue';
import { UnknownShow, type CatalogueService } from './catalogue-service';

export const editorJson = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return origin === null || origin === new URL(request.url).origin;
}

// Enforce limits for streamed/chunked bodies too, before parsing JSON or multipart.
export async function boundedBody(request: Request, limit: number): Promise<Uint8Array | null> {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); return null; }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; }
  return result;
}

interface Dependencies {
  authorize: (request: Request) => Response | undefined;
  catalogue: CatalogueService;
}
export function catalogueHandlers({ authorize, catalogue }: Dependencies) {
  return {
    GET: async (request: Request) => {
      const denied = authorize(request);
      if (denied) return denied;
      try { return editorJson((await catalogue.load()).snapshot().shows); }
      catch { return editorJson({ error: 'Shows konnten nicht geladen werden. Cockpit-Konfiguration prüfen.' }, 502); }
    },
    POST: async (request: Request) => {
      const denied = authorize(request);
      if (denied) return denied;
      if (!sameOrigin(request)) return editorJson({ error: 'Ungültiger Ursprung.' }, 403);
      if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json')
        return editorJson({ error: 'JSON erforderlich.' }, 415);
      let value: unknown;
      try {
        const bytes = await boundedBody(request, 32768);
        if (!bytes) return editorJson({ error: 'Show zu groß.' }, 413);
        value = JSON.parse(new TextDecoder().decode(bytes));
      } catch { return editorJson({ error: 'Ungültiges JSON.' }, 400); }
      const draft = parseDraft(value);
      const id = value && typeof value === 'object' ? (value as Record<string, unknown>)._id : undefined;
      if (!draft || (id !== undefined && !validId(id)))
        return editorJson({ error: 'Name, Titel und Bilder prüfen.' }, 400);
      try { return editorJson(await catalogue.save(draft, id as string | undefined)); }
      catch (error) {
        return editorJson({ error: error instanceof UnknownShow ? 'Show nicht gefunden.' : 'Speichern nicht bestätigt. Bitte erneut versuchen.' },
          error instanceof UnknownShow ? 404 : 502);
      }
    },
  };
}

interface UploadDependencies {
  authorize: Dependencies['authorize'];
  upload: (file: File) => Promise<ShowImage>;
  configured: () => boolean;
}
export function uploadHandler({ authorize, upload, configured }: UploadDependencies) {
  return async (request: Request) => {
    const denied = authorize(request);
    if (denied) return denied;
    if (!sameOrigin(request)) return editorJson({ error: 'Ungültiger Ursprung.' }, 403);
    if (!configured()) return editorJson({ error: 'Cockpit-Bildupload ist noch nicht konfiguriert.' }, 503);
    if (!request.headers.get('content-type')?.startsWith('multipart/form-data;'))
      return editorJson({ error: 'Bilddatei erforderlich.' }, 415);
    let file: File;
    try {
      const bytes = await boundedBody(request, maxImageBytes + 65536);
      if (!bytes) return editorJson({ error: 'Bild zu groß (max. 10 MB).' }, 413);
      const form = await new Response(bytes as BodyInit, { headers: { 'Content-Type': request.headers.get('content-type')! } }).formData();
      const candidate = form.get('file');
      if (!(candidate instanceof File) || form.getAll('file').length !== 1)
        return editorJson({ error: 'Eine Bilddatei erforderlich.' }, 400);
      file = candidate;
      if (file.size > maxImageBytes) return editorJson({ error: 'Bild zu groß (max. 10 MB).' }, 413);
      const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
      const signature = file.type === 'image/png' ? header.slice(0, 8).join(',') === '137,80,78,71,13,10,26,10'
        : file.type === 'image/jpeg' ? header[0] === 255 && header[1] === 216 && header[2] === 255
        : file.type === 'image/webp' ? new TextDecoder().decode(header.slice(0, 4)) === 'RIFF' && new TextDecoder().decode(header.slice(8)) === 'WEBP'
        : false;
      if (!signature) return editorJson({ error: 'JPG, PNG oder WebP erforderlich.' }, 400);
    } catch { return editorJson({ error: 'Ungültige Bilddatei.' }, 400); }
    try { return editorJson(await upload(file)); }
    catch { return editorJson({ error: 'Bildupload nicht bestätigt. Bitte erneut versuchen.' }, 502); }
  };
}
