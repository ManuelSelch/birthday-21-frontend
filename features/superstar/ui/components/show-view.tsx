import { Alert, Badge, Switch } from '@mantine/core';
import { IconDeviceTv } from '@tabler/icons-react';
import type { ShowState, ShowAction } from '../../domain/show';
import { performers, jurors } from './show-data';
import { Projector } from './projector';
import { JuryScreen } from './jury-screen';
import { ShowControls } from './show-controls';
import { cx } from './show-styles';
import { juryIds } from '../../domain/catalog';
import type { ShowConnection } from '../../app/use-live-show';
import { ConnectionStatus } from './connection-status';

interface ShowViewProps {
  state: ShowState;
  onAction: (action: ShowAction) => void;
  live?: { connection: ShowConnection; pending: boolean; error: string | null };
}

export function ShowView({state, onAction, live}: ShowViewProps) {
  return <div className={cx(`studio ${state.solo?'solo':''}`)}>
    <header className={cx('studio-header')}>
      <a className={cx('studio-brand')} href="/superstar"><span>21</span><div>SUPERSTAR<small>MANUEL / MARCO / DAVID</small></div></a>
      {live ? <ConnectionStatus connection={live.connection}/> : <a href="/superstar/control">Live-Regie</a>}
      <Badge variant="light" color="gray">{live ? 'LIVE-REGIE' : 'LOKALE DEMO'}</Badge>
    </header>
    <a className={cx('skip-link')} href="#show-preview">Zur Showvorschau</a>
    <main id="show-preview" className={cx('main')}>
      <section className={cx('intro')}><div><span className={cx('eyebrow')}>DREI MAL 21 / DIE GEBURTSTAGSSHOW</span><h1>Ein Abend. Lauter Superstars.</h1></div></section>
      {live && <>
        <nav aria-label="Show-Bildschirme" className="mb-6 flex flex-wrap gap-5 text-sm">
          <a href="/superstar/projector" target="_blank" rel="noopener noreferrer">Beamer öffnen</a>
          {juryIds.map((id, index) => <a key={id} href={`/superstar/jury/${id}`} target="_blank" rel="noopener noreferrer">{jurors[index].name} öffnen</a>)}
          <a href="/admin/login?returnTo=/superstar/control">Anmeldung</a>
        </nav>
        {live.error && <Alert role="alert" color="red" mb="md">{live.error}</Alert>}
      </>}
      <div className={cx('workspace')}>
        <div className={cx('outputs')}>
          <div className={cx('output-heading')}><span><IconDeviceTv size={16}/> BEAMER / PUBLIKUM</span><Switch size="xs" label="Nur Beamer" checked={state.solo} onChange={event=>onAction({type:'solo',solo:event.currentTarget.checked})}/></div>
          <section aria-label="Beamer-Vorschau">
            <Projector scene={state.scene} performer={performers[state.performerIndex]} celebrate={state.celebrate} burst={state.burst} reaction={state.reaction}/>
          </section>
          <div className={cx('jury-heading')}><span>JURYTISCH / DREI EINZELNE 16:9-DISPLAYS</span><span>VON LINKS NACH RECHTS</span></div>
          <section className={cx('jury-grid')} aria-label="Jury-Displays">
            {jurors.map((juror,index)=><JuryScreen key={juror.name} index={index} active={state.active[index]||state.celebrate} mode={state.mode} burst={state.burst}/>)}
          </section>
        </div>
        <ShowControls state={state} onAction={onAction} live={Boolean(live)} disabled={Boolean(live && (live.connection !== 'connected' || live.pending))}/>
      </div>
    </main>
  </div>;
}
