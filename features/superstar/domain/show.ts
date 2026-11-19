export const sceneLabels = { act: 'Auftritt', camera: 'Kamera', vote: 'Abstimmung', results: 'Ergebnis', idle: 'Showpause' } as const;
export type Scene = keyof typeof sceneLabels;
export type JuryMode = 'portraits' | 'art';
export const reactionDuration = 3200;

export function parseScene(value: string | string[] | undefined): Scene {
  if (typeof value === 'string' && Object.hasOwn(sceneLabels, value)) return value as Scene;
  return 'act';
}

export interface ShowState {
  scene: Scene;
  performerIndex: number;
  imageIndex: number;
  active: boolean[];
  celebrate: boolean;
  burst: number;
  reaction: number | null;
  mode: JuryMode;
  solo: boolean;
}
export type ShowAction =
  | { type: 'scene'; scene: Scene }
  | { type: 'performer'; index: number }
  | { type: 'image'; index: number }
  | { type: 'buzz'; index: number }
  | { type: 'expire'; index: number }
  | { type: 'clear-reaction' }
  | { type: 'golden' }
  | { type: 'reset' }
  | { type: 'mode'; mode: JuryMode }
  | { type: 'solo'; solo: boolean };

export function initialShow(scene: Scene = 'act'): ShowState {
  return { scene, performerIndex: 0, imageIndex: 0, active: [false, false, false], celebrate: false, burst: 0, reaction: null, mode: 'portraits', solo: false };
}

export function updateShow(state: ShowState, action: ShowAction): ShowState {
  switch (action.type) {
    case 'scene': return { ...state, scene: action.scene, celebrate: false, reaction: null };
    case 'performer': return { ...state, performerIndex: action.index, imageIndex: 0, active: [false, false, false], celebrate: false, reaction: null };
    case 'image': return { ...state, imageIndex: action.index };
    case 'buzz': return { ...state, active: state.active.map((active, index) => index === action.index || active), celebrate: false, reaction: action.index, burst: state.burst + 1 };
    case 'expire': return { ...state, active: state.active.map((active, index) => index === action.index ? false : active) };
    case 'clear-reaction': return { ...state, reaction: null };
    case 'golden': return { ...state, celebrate: true, reaction: null, burst: state.burst + 1 };
    case 'reset': return { ...state, active: [false, false, false], celebrate: false, reaction: null };
    case 'mode': return { ...state, mode: action.mode };
    case 'solo': return { ...state, solo: action.solo };
  }
}
