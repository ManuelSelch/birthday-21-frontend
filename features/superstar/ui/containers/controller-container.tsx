'use client';

import { useState } from 'react';
import { useLiveShow } from '../../app/use-live-show';
import { parseCommand } from '../../domain/live-show';
import type { ShowAction } from '../../domain/show';
import { ShowView } from '../components/show-view';
import { ConnectionStatus } from '../components/connection-status';

export function ControllerContainer() {
  const live = useLiveShow();
  const [solo, setSolo] = useState(false);
  function onAction(action: ShowAction) {
    if (action.type === 'solo') { setSolo(action.solo); return; }
    const command = parseCommand(action);
    if (command) void live.send(command);
  }

  if (!live.state) return <main className="p-6"><ConnectionStatus connection={live.connection}/></main>;
  return <ShowView state={{ ...live.state, solo }} onAction={onAction} live={live}/>;
}
