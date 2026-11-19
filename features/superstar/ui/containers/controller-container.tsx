'use client';

import { useState } from 'react';
import { useLiveShow } from '../../app/use-live-show';
import { parseCommand } from '../../domain/live-show';
import type { ShowAction } from '../../domain/show';
import { ShowView } from '../components/show-view';
import { ShowEditorContainer } from './show-editor-container';
import { ConnectionStatus } from '../components/connection-status';

export function ControllerContainer() {
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
  return <ShowView state={{ ...live.state, solo }} shows={live.shows} onEdit={() => setEditing(true)} onAction={onAction} live={live}/>;
}
