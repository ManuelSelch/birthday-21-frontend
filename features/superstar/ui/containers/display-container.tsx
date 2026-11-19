'use client';

import { useLiveShow } from '../../app/use-live-show';
import { DisplayView } from '../components/display-view';

export function DisplayContainer({ jurorIndex }: { jurorIndex?: number }) {
  const { state, shows, connection, sessionId } = useLiveShow();
  return <DisplayView key={sessionId} state={state} shows={shows} connection={connection} jurorIndex={jurorIndex}/>;
}
