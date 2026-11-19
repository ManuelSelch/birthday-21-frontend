import { juryIds } from './catalog';
import { demoShows, parseCatalogue, type ShowDefinition } from './show-catalogue';
import { sceneLabels, type ShowAction, type ShowState } from './show';

export type ShowCommand = Exclude<ShowAction, { type: 'expire' | 'clear-reaction' | 'solo' }>;

export interface ShowSnapshot {
  sessionId: string;
  revision: number;
  serverTime: number;
  state: ShowState;
  shows: ShowDefinition[];
  juryExpiresAt: (number | null)[];
  reactionExpiresAt: number | null;
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function index(value: unknown, length: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < length;
}
function timestamp(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isFinite(value) && value >= 0);
}

export function parseCommand(value: unknown, shows = demoShows, performerIndex = 0): ShowCommand | null {
  if (!record(value)) return null;
  const keys = Object.keys(value).sort().join(',');
  switch (value.type) {
    case 'scene':
      if (keys === 'scene,type' && typeof value.scene === 'string' && Object.hasOwn(sceneLabels, value.scene))
        return { type: 'scene', scene: value.scene as ShowState['scene'] };
      return null;
    case 'performer':
    case 'buzz':
      if (keys === 'index,type' && index(value.index, value.type === 'buzz' ? juryIds.length : shows.length))
        return { type: value.type, index: value.index };
      return null;
    case 'image':
      return keys === 'index,type' && index(value.index, shows[performerIndex]?.images.length ?? 0)
        ? { type: 'image', index: value.index } : null;
    case 'mode':
      if (keys === 'mode,type' && (value.mode === 'portraits' || value.mode === 'art'))
        return { type: 'mode', mode: value.mode };
      return null;
    case 'golden':
    case 'reset':
      return keys === 'type' ? { type: value.type } : null;
    default: return null;
  }
}

export function parseSnapshot(value: unknown): ShowSnapshot | null {
  if (!record(value) || !record(value.state)) return null;
  const state = value.state;
  const shows = parseCatalogue(value.shows);
  if (!shows) return null;
  if (typeof value.sessionId !== 'string' || !value.sessionId ||
    !Number.isSafeInteger(value.revision) || (value.revision as number) < 0 ||
    !timestamp(value.serverTime) || value.serverTime === null ||
    !Array.isArray(value.juryExpiresAt) || value.juryExpiresAt.length !== juryIds.length ||
    !value.juryExpiresAt.every(timestamp) || !timestamp(value.reactionExpiresAt) ||
    !parseCommand({ type: 'scene', scene: state.scene }) ||
    !(shows.length ? index(state.performerIndex, shows.length) : state.performerIndex === 0) ||
    !index(state.imageIndex, Math.max(1, shows[state.performerIndex as number]?.images.length ?? 0)) ||
    !Array.isArray(state.active) || state.active.length !== juryIds.length ||
    !state.active.every(active => typeof active === 'boolean') ||
    typeof state.celebrate !== 'boolean' || state.solo !== false ||
    !Number.isSafeInteger(state.burst) || (state.burst as number) < 0 ||
    !(state.reaction === null || index(state.reaction, juryIds.length)) ||
    !parseCommand({ type: 'mode', mode: state.mode })) return null;
  return value as unknown as ShowSnapshot;
}

export function visibleShow(snapshot: ShowSnapshot, serverNow: number): ShowState {
  return {
    ...snapshot.state,
    active: snapshot.state.active.map((active, index) => active &&
      snapshot.juryExpiresAt[index] !== null && snapshot.juryExpiresAt[index]! > serverNow),
    reaction: snapshot.reactionExpiresAt !== null && snapshot.reactionExpiresAt > serverNow
      ? snapshot.state.reaction : null,
  };
}
