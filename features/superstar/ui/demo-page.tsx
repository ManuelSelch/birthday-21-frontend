'use client';

import type { Scene } from '../domain/show';
import { demoShows } from '../domain/show-catalogue';
import { useShow } from '../app/use-show';
import { ShowHeader } from './components/show-header';
import { ShowIntro } from './components/show-intro';
import { ShowPreview } from './components/show-preview';
import { ShowControls } from './components/show-controls';
import { cx } from './components/show-styles';

export function DemoPage({ initialScene }: { initialScene: Scene }) {
  const { state, send } = useShow(initialScene);
  return <div className={cx(`studio ${state.solo?'solo':''}`)}>
    <ShowHeader/>
    <a className={cx('skip-link')} href="#show-preview">Zur Showvorschau</a>
    <main id="show-preview" className={cx('main')}>
      <ShowIntro/>
      <div className={cx('workspace')}>
        <ShowPreview state={state} shows={demoShows} onAction={send} live={false}/>
        <ShowControls shows={demoShows} state={state} onAction={send} live={false} disabled={false}/>
      </div>
    </main>
  </div>;
}
