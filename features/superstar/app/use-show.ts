'use client';

import { useEffect, useReducer, useRef } from 'react';
import { initialShow, reactionDuration, updateShow, type Scene, type ShowAction } from '../domain/show';

export function useShow(initialScene: Scene) {
  const [state, dispatch] = useReducer(updateShow, initialScene, initialShow);
  const timers = useRef<Array<ReturnType<typeof setTimeout> | undefined>>([]);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function clearTimers() {
    timers.current.forEach(timer => clearTimeout(timer));
    clearTimeout(reactionTimer.current);
  }

  useEffect(() => clearTimers, []);

  function send(action: ShowAction) {
    if (action.type === 'reset' || action.type === 'performer') clearTimers();
    if (action.type === 'scene' || action.type === 'golden') clearTimeout(reactionTimer.current);
    if (action.type === 'buzz') {
      clearTimeout(timers.current[action.index]);
      clearTimeout(reactionTimer.current);
      timers.current[action.index] = setTimeout(() => dispatch({ type: 'expire', index: action.index }), reactionDuration);
      reactionTimer.current = setTimeout(() => dispatch({ type: 'clear-reaction' }), reactionDuration);
    }
    if (action.type === 'scene') {
      const url = new URL(window.location.href);
      url.searchParams.set('scene', action.scene);
      window.history.replaceState(null, '', url);
    }
    dispatch(action);
  }

  return { state, send };
}
