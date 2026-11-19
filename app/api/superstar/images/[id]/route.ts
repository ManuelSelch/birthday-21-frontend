import { auth } from '@/features/admin-auth/server';
import { editorJson } from '@/features/superstar/app/editor-http';
import { validId } from '@/features/superstar/domain/show-catalogue';
import { superstarRuntime } from '@/features/superstar/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = auth.authorize(request);
  if (denied) return denied;
  const { id } = await context.params;
  if (!validId(id)) return editorJson({ error: 'Ungültiges Bild.' }, 400);
  try { return await superstarRuntime().store.image(id); }
  catch { return editorJson({ error: 'Bild konnte nicht geladen werden.' }, 502); }
}
