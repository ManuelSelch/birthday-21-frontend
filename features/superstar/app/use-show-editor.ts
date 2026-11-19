'use client';

import { useEffect, useRef, useState } from 'react';
import { maxImageBytes, maxImages, parseDraft, type ShowImage, type ShowDefinition } from '../domain/show-catalogue';
import { saveShow, uploadShowImage } from '../infra/editor-browser';

const emptyShow = (): ShowDefinition => ({ _id: '', name: '', title: '', description: '', sortOrder: 0, images: [] });
type Destination = { show: ShowDefinition } | 'close';
export function useShowEditor(shows: ShowDefinition[], onClose: () => void) {
  const [base, setBase] = useState<ShowDefinition | null>(shows[0] ?? null);
  const [draft, setDraft] = useState<ShowDefinition>(() => structuredClone(shows[0] ?? emptyShow()));
  const [imageIndex, setImageIndex] = useState(0);
  const [pending, setPending] = useState<Destination | null>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const dirty = !base || JSON.stringify(draft) !== JSON.stringify(base);

  useEffect(() => {
    if (!dirty && !busy) return;
    const prevent = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', prevent);
    return () => window.removeEventListener('beforeunload', prevent);
  }, [dirty, busy]);

  function open(destination: Destination) {
    setPending(null);
    if (destination === 'close') { onClose(); return; }
    const show = destination.show;
    setBase(show._id ? structuredClone(show) : null);
    setDraft(structuredClone(show));
    setImageIndex(0); setError(null); setSaved(false);
  }
  function navigate(destination: Destination) {
    if (busyRef.current) return;
    if (dirty) { setPending(destination); return; }
    open(destination);
  }
  function change(patch: Partial<ShowDefinition>) {
    if (busyRef.current) return;
    setDraft(current => ({ ...current, ...patch })); setSaved(false);
  }
  async function save() {
    if (busyRef.current) return;
    if (!parseDraft(draft)) { setError('Name, Titel und Bilder prüfen.'); return; }
    busyRef.current = true; setBusy(true); setError(null);
    try {
      const result = await saveShow(draft);
      setDraft(result); setBase(structuredClone(result)); setSaved(true);
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Speichern fehlgeschlagen.'); }
    finally { busyRef.current = false; setBusy(false); }
  }
  async function upload(files: File[]) {
    if (busyRef.current || !files.length) return;
    if (draft.images.length + files.length > maxImages) { setError('Maximal 20 Bilder pro Show.'); return; }
    if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > maxImageBytes)) {
      setError('JPG, PNG oder WebP, maximal 10 MB pro Bild.'); return;
    }
    busyRef.current = true; setBusy(true); setError(null); setSaved(false);
    const uploaded: ShowImage[] = [];
    try {
      for (const file of files) uploaded.push(await uploadShowImage(file));
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Bildupload fehlgeschlagen.'); }
    finally {
      setDraft(current => ({ ...current, images: [...current.images, ...uploaded] }));
      busyRef.current = false; setBusy(false);
    }
  }
  return {
    draft, dirty, busy, error, saved, imageIndex, pending: Boolean(pending),
    change, save, upload, setImageIndex,
    select: (show: ShowDefinition) => { if (show._id !== draft._id) navigate({ show }); },
    add: () => navigate({ show: emptyShow() }),
    close: () => navigate('close'),
    discard: () => { if (!busyRef.current) open({ show: base ?? shows[0] ?? emptyShow() }); },
    removeImage: (index: number) => { change({ images: draft.images.filter((_, i) => i !== index) }); setImageIndex(0); },
    cancelNavigation: () => setPending(null),
    confirmNavigation: () => { if (pending && !busyRef.current) open(pending); },
  };
}
export type ShowEditorState = ReturnType<typeof useShowEditor>;
