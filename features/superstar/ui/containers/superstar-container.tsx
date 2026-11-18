'use client';

import type { Scene } from '../../domain/show';
import { useShow } from '../../app/use-show';
import { ShowView } from '../components/show-view';

export function SuperstarContainer({initialScene}: {initialScene: Scene}) {
  const {state, send} = useShow(initialScene);
  return <ShowView state={state} onAction={send}/>;
}
