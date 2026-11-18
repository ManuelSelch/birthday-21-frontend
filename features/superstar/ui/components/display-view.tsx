import type { ShowState } from '../../domain/show';
import type { ShowConnection } from '../../app/use-live-show';
import { Projector } from './projector';
import { JuryScreen } from './jury-screen';
import { performers, jurors } from './show-data';
import { ConnectionStatus } from './connection-status';
import { cx } from './show-styles';

interface DisplayViewProps {
  state: ShowState | null;
  connection: ShowConnection;
  jurorIndex?: number;
}

export function DisplayView({ state, connection, jurorIndex }: DisplayViewProps) {
  return (
    <main className={cx('studio display')} aria-label={jurorIndex === undefined ? 'Beamer' : `${jurors[jurorIndex].name} Jury-Display`}>
      {state && <div className={cx('display-frame')}>
        {jurorIndex === undefined
          ? <Projector scene={state.scene} performer={performers[state.performerIndex]} celebrate={state.celebrate} burst={state.burst} reaction={state.reaction}/>
          : <JuryScreen index={jurorIndex} active={state.active[jurorIndex] || state.celebrate} mode={state.mode} burst={state.burst}/>}
      </div>}
      {connection !== 'connected' && <div className="fixed bottom-4 left-4 right-4 z-20">
        <ConnectionStatus connection={connection}/>
      </div>}
    </main>
  );
}
