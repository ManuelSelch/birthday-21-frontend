import { Alert, Switch } from '@mantine/core';
import { IconDeviceTv } from '@tabler/icons-react';
import type { ShowAction, ShowState } from '../../domain/show';
import type { ShowDefinition } from '../../domain/show-catalogue';
import { performerFor, performers, jurors } from './show-data';
import { Projector } from './projector';
import { JuryScreen } from './jury-screen';
import { cx } from './show-styles';

export function ShowPreview({ state, shows, onAction, live }: {
  state: ShowState;
  shows: ShowDefinition[];
  onAction: (action: ShowAction) => void;
  live: boolean;
}) {
  const selected = shows[state.performerIndex];
  return <div className={cx('outputs')}>
    <div className={cx('output-heading')}><span><IconDeviceTv size={16}/> {live ? 'Beamer' : 'BEAMER / PUBLIKUM'}</span>{!live && <Switch size="xs" label="Nur Beamer" checked={state.solo} onChange={event=>onAction({type:'solo',solo:event.currentTarget.checked})}/>}</div>
    <section aria-label="Beamer-Vorschau">
      {selected ? <Projector scene={state.scene} performer={live ? performerFor(selected) : performers[state.performerIndex]} imageIndex={state.imageIndex} celebrate={state.celebrate} burst={state.burst} reaction={state.reaction}/> : <Alert>Keine Shows vorhanden. Bitte eine Show hinzufügen.</Alert>}
    </section>
    <div className={cx('jury-heading')}><span>{live ? 'Jurytisch' : 'JURYTISCH / DREI EINZELNE 16:9-DISPLAYS'}</span><span>VON LINKS NACH RECHTS</span></div>
    <section className={cx('jury-grid')} aria-label="Jury-Displays">
      {jurors.map((juror,index)=><JuryScreen key={juror.name} index={index} active={state.active[index]||state.celebrate} mode={state.mode} burst={state.burst}/>)}
    </section>
  </div>;
}
