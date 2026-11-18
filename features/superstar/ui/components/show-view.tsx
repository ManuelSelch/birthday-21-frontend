import { Badge, Switch } from '@mantine/core';
import { IconDeviceTv } from '@tabler/icons-react';
import type { ShowState, ShowAction } from '../../domain/show';
import { performers, jurors } from './show-data';
import { Projector } from './projector';
import { JuryScreen } from './jury-screen';
import { ShowControls } from './show-controls';
import { cx } from './show-styles';

interface ShowViewProps {
  state: ShowState;
  onAction: (action: ShowAction) => void;
}

export function ShowView({state, onAction}: ShowViewProps) {
  return <div className={cx(`studio ${state.solo?'solo':''}`)}>
    <header className={cx('studio-header')}>
      <a className={cx('studio-brand')} href="/superstar"><span>21</span><div>SUPERSTAR<small>MANUEL / MARCO / DAVID</small></div></a>
      <Badge variant="light" color="gray">LOKALE DEMO</Badge>
    </header>
    <a className={cx('skip-link')} href="#show-preview">Zur Showvorschau</a>
    <main id="show-preview" className={cx('main')}>
      <section className={cx('intro')}><div><span className={cx('eyebrow')}>DREI MAL 21 / DIE GEBURTSTAGSSHOW</span><h1>Ein Abend. Lauter Superstars.</h1></div></section>
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
        <ShowControls state={state} onAction={onAction}/>
      </div>
    </main>
  </div>;
}
