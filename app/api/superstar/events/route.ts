import { eventHandler } from '@/features/superstar/app/http';
import { editorJson } from '@/features/superstar/app/editor-http';
import { showService } from '@/features/superstar/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const service = await showService();
    return eventHandler(() => service)(request);
  } catch { return editorJson({ error: 'Shows konnten nicht geladen werden.' }, 503); }
}
