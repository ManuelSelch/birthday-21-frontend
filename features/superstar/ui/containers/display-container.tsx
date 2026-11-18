'use client';

import { useLiveShow } from '../../app/use-live-show';
import { DisplayView } from '../components/display-view';

export function DisplayContainer({ jurorIndex }: { jurorIndex?: number }) {
  const { state, connection, sessionId } = useLiveShow();
  return <DisplayView key={sessionId} state={state} connection={connection} jurorIndex={jurorIndex}/>;
}
