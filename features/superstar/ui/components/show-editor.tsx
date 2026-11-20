import { Alert, Badge, Button, FileButton, Group, Modal, Stack, TextInput, Textarea } from '@mantine/core';
import { IconArrowLeft, IconCheck, IconDeviceTv, IconPhoto, IconPlus, IconUpload, IconX } from '@tabler/icons-react';
import type { ShowEditorState } from '../../app/use-show-editor';
import { imageUrl, type ShowDefinition } from '../../domain/show-catalogue';
import { performerFor } from './show-data';
import { Projector } from './projector';
import { cx } from './show-styles';

interface Props { editor: ShowEditorState; shows: ShowDefinition[] }
export function ShowEditor({ editor, shows }: Props) {
  const { draft, dirty, busy } = editor;
  return <div className={cx('studio')}>
    <header className={cx('studio-header')}>
      <div className={cx('studio-brand')}><span>21</span><div>SUPERSTAR<small>MANUEL / MARCO / DAVID</small></div></div>
    </header>
    <main className="mx-auto max-w-[1680px] px-4 pt-6 pb-14 sm:px-8">
      <Button variant="transparent" color="gray" size="compact-sm" leftSection={<IconArrowLeft size={15}/>} onClick={editor.close} disabled={busy}>Zur Regie</Button>
      <h1 className="my-5 font-serif text-[32px] font-normal tracking-tight">Shows bearbeiten</h1>
      <div className="grid items-start gap-6 min-[700px]:grid-cols-[200px_minmax(0,1fr)] min-[1200px]:grid-cols-[230px_minmax(320px,1fr)_minmax(320px,1.1fr)]">
        <aside>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-[22px] font-normal">Shows</h2><span className="text-xs text-[var(--site-muted)]">{shows.length}</span></div>
          <Stack gap={6} className="max-[699px]:max-h-52 max-[699px]:overflow-auto">
            {shows.map((show, index) => <button type="button" key={show._id} disabled={busy} onClick={() => editor.select(show)}
              className={'flex w-full cursor-pointer items-center gap-3 rounded border px-3 py-2.5 text-left disabled:cursor-wait ' +
                (draft._id === show._id ? 'border-[var(--site-accent)] bg-[var(--site-surface)]' : 'border-transparent hover:bg-[var(--site-surface)]')}>
              <span className="text-[11px] text-[var(--site-accent)]">{String(index + 1).padStart(2, '0')}</span>
              <span><strong className="block text-[13px] font-medium">{show.name}</strong><small className="mt-1 block text-[11px] text-[var(--site-muted)]">{show.title}</small></span>
            </button>)}
          </Stack>
          <Button fullWidth variant="outline" leftSection={<IconPlus size={16}/>} mt="md" onClick={editor.add} disabled={busy}>Show hinzufügen</Button>
        </aside>
        <section className="min-w-0 rounded border border-[var(--site-border)] bg-[var(--site-surface)] p-[18px]" aria-label="Show bearbeiten">
          <div className="mb-4 flex items-center justify-between gap-3"><h2 className="font-serif text-xl font-normal">{draft._id ? 'Show bearbeiten' : 'Neue Show'}</h2><Badge variant="light" color={dirty ? 'yellow' : 'gray'}>{dirty ? 'Ungespeichert' : 'Gespeichert'}</Badge></div>
          <form onSubmit={event => { event.preventDefault(); void editor.save(); }}>
            <fieldset disabled={busy} className="m-0 min-w-0 border-0 p-0">
              <Stack gap="sm">
                {editor.error && <Alert color="red" role="alert">{editor.error}</Alert>}
                <TextInput label="Name" required maxLength={100} value={draft.name} onChange={event => editor.change({ name: event.currentTarget.value })}/>
                <TextInput label="Titel" required maxLength={160} value={draft.title} onChange={event => editor.change({ title: event.currentTarget.value })}/>
                <Textarea label="Beschreibung" autosize minRows={2} maxLength={500} value={draft.description} onChange={event => editor.change({ description: event.currentTarget.value })}/>
                <section aria-label="Beamerbilder">
                  <Group justify="space-between" mb={8}><span className="text-xs">Beamerbilder</span><FileButton multiple accept="image/jpeg,image/png,image/webp" onChange={files => void editor.upload(files)}>{props => <Button {...props} disabled={busy} size="xs" variant="subtle" leftSection={<IconUpload size={14}/>}>Hochladen</Button>}</FileButton></Group>
                  {draft.images.length ? <div className="grid grid-cols-3 gap-2">
                    {draft.images.map((image, index) => <div className="relative" key={image._id}>
                      <button type="button" aria-label={'Bild ' + (index + 1) + ' in Vorschau anzeigen'} onClick={() => editor.setImageIndex(index)}
                        className={'block w-full cursor-pointer border-2 ' + (editor.imageIndex === index ? 'border-[var(--site-accent)]' : 'border-transparent')}>
                        <img src={imageUrl(image)} alt={'Beamerbild ' + (index + 1)} className="aspect-square w-full object-cover"/>
                      </button>
                      <Button type="button" size="compact-xs" variant="default" color="red" className="absolute! top-1 right-1" aria-label={'Bild ' + (index + 1) + ' entfernen'} onClick={() => editor.removeImage(index)}><IconX size={14}/></Button>
                    </div>)}
                  </div> : <div className="flex min-h-20 flex-col items-center justify-center gap-2 rounded border border-dashed border-[var(--site-border)] text-[var(--site-accent)]"><IconPhoto size={24} stroke={1}/><span className="text-xs">Keine Bilder</span></div>}
                  <p className="mt-2 text-[11px] text-[var(--site-muted)]">JPG, PNG, WebP / max. 10 MB</p>
                </section>
              </Stack>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--site-border)] pt-3.5">
                <span className="text-[10px] text-[var(--site-muted)]" role="status">{editor.saved ? 'Gespeichert' : ''}</span>
                <Group gap={8}><Button variant="default" disabled={!dirty || busy} onClick={editor.discard}>Verwerfen</Button><Button type="submit" leftSection={<IconCheck size={16}/>} disabled={!dirty || busy} loading={busy}>Speichern</Button></Group>
              </div>
            </fieldset>
          </form>
        </section>
        <section className="min-w-0 min-[700px]:max-[1199px]:col-start-2" aria-label="Beamer-Entwurf">
          <div className="mb-4 flex items-center gap-2 text-[10px] tracking-wider text-[var(--site-muted)]"><IconDeviceTv size={16}/><span>BEAMER-VORSCHAU</span><Badge size="xs" variant="outline" color="gray" className="ml-auto">NICHT LIVE</Badge></div>
          <Projector scene="act" performer={performerFor(draft)} imageIndex={editor.imageIndex} celebrate={false} burst={0} reaction={null} active={[]}/>
        </section>
      </div>
    </main>
    <Modal opened={editor.pending} onClose={editor.cancelNavigation} title="Ungespeicherte Änderungen" centered>
      <p className="mb-4 text-sm">Änderungen verwerfen und fortfahren?</p><Group justify="flex-end"><Button variant="default" onClick={editor.cancelNavigation}>Weiter bearbeiten</Button><Button onClick={editor.confirmNavigation}>Änderungen verwerfen</Button></Group>
    </Modal>
  </div>;
}
