import { createReducer } from '../utils';

export const togglePlayer = () => ({ type: 'PLAYER_TOGGLED' });

export const toggleFullscreen = () => ({ type: 'FULLSCREEN_TOGGLED' });

const initState = {
  isPlayerEnabled: false,
  isFullscreenEnabled: false
};

const handlers = {
  PLAYER_TOGGLED: (state) => ({ ...state, isPlayerEnabled: !state.isPlayerEnabled }),
  FULLSCREEN_TOGGLED: (state) => ({ ...state, isFullscreenEnabled: !state.isFullscreenEnabled })
};

export const appReducer = createReducer(initState, handlers);