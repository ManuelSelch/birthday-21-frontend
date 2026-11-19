import { parseDefinition, parseImage, type ShowDefinition, type ShowImage } from '../domain/show-catalogue';

export async function saveShow(show: ShowDefinition): Promise<ShowDefinition> {
  const response = await fetch('/api/superstar/shows', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...show, _id: show._id || undefined }),
  });
  const value = await response.json();
  if (!response.ok) throw new Error(response.status === 401 ? 'Sitzung abgelaufen. Bitte erneut anmelden.' : value.error || 'Speichern fehlgeschlagen.');
  const saved = parseDefinition(value);
  if (!saved) throw new Error('Speichern nicht bestätigt.');
  return saved;
}
export async function uploadShowImage(file: File): Promise<ShowImage> {
  const form = new FormData();
  form.append('file', file);
  const response = await fetch('/api/superstar/images', { method: 'POST', body: form });
  const value = await response.json();
  if (!response.ok) throw new Error(response.status === 401 ? 'Sitzung abgelaufen. Bitte erneut anmelden.' : value.error || 'Bildupload fehlgeschlagen.');
  const image = parseImage(value);
  if (!image) throw new Error('Bildupload nicht bestätigt.');
  return image;
}
