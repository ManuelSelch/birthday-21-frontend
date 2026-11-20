'use client';

import { useState } from 'react';
import { useLiveShow } from '../app/use-live-show';
import { parseCommand } from '../domain/live-show';
import type { ShowAction } from '../domain/show';
import { ShowEditorContainer } from './containers/show-editor-container';
import { ConnectionStatus } from './components/connection-status';
import { ShowHeader } from './components/show-header';
import { ShowIntro } from './components/show-intro';
import { ShowNavigation } from './components/show-navigation';
import { ShowPreview } from './components/show-preview';
import { ShowControls } from './components/show-controls';
import { cx } from './components/show-styles';

export function ControlPage() {
  const live = useLiveShow();
  const [solo, setSolo] = useState(false);
  const [editing, setEditing] = useState(false);
  function onAction(action: ShowAction) {
    if (action.type === 'solo') { setSolo(action.solo); return; }
    const command = parseCommand(action, live.shows, live.state?.performerIndex);
    if (command) void live.send(command);
  }

  if (!live.state) return <main className="p-6"><ConnectionStatus connection={live.connection}/></main>;
  if (editing) return <ShowEditorContainer shows={live.shows} onClose={() => setEditing(false)}/>;
  const state = { ...live.state, solo };
  return <div className={cx(`studio ${state.solo?'solo':''}`)}>
    <ShowHeader connection={live.connection}/>
    <a className={cx('skip-link')} href="#show-preview">Zur Showvorschau</a>
    <main id="show-preview" className={cx('main')}>
      <ShowIntro/>
      <ShowNavigation onEdit={() => setEditing(true)} error={live.error}/>
      <div className={cx('workspace')}>
        <ShowPreview state={state} shows={live.shows} onAction={onAction} live/>
        <ShowControls shows={live.shows} state={state} onAction={onAction} live disabled={live.connection !== 'connected' || live.pending}/>
      </div>
    </main>
  </div>;
}
