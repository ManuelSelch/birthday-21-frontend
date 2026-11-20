import { createHash, timingSafeEqual } from 'node:crypto';
import { juryIds } from '../domain/catalog';
import type { ShowService } from './show-service';

interface BuzzerDependencies {
  key: () => string | undefined;
  show: () => ShowService | Promise<ShowService>;
}

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function buzzerHandler({ key, show }: BuzzerDependencies) {
  return async (request: Request, name: string): Promise<Response> => {
    const secret = key();
    if (!secret) return json({ error: 'Buzzer nicht konfiguriert.' }, 503);
    const authorization = request.headers.get('authorization') ?? '';
    const token = /^Bearer ([^\s]+)$/i.exec(authorization)?.[1];
    const digest = (value: string) => createHash('sha256').update(value).digest();
    if (!token || !timingSafeEqual(digest(token), digest(secret)))
      return json({ error: 'Nicht autorisiert.' }, 401);

    const index = juryIds.findIndex(id => id === name);
    if (index < 0) return json({ error: 'Unbekanntes Jurymitglied.' }, 404);

    try {
      const service = await show();
      service.command({ type: 'buzz', index });
      return json({ ok: true }, 200);
    } catch {
      return json({ error: 'Shows konnten nicht geladen werden.' }, 502);
    }
  };
}
