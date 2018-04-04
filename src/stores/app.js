import { createReducer } from '../utils';

export const toggleLoading = () => ({ type: 'LOADING_SCREEN_TOGGLED' });

export const togglePlayer = () => ({ type: 'PLAYER_TOGGLED' });

export const toggleFullscreen = () => ({ type: 'FULLSCREEN_TOGGLED' });

export const streamToGoogleCast = (option) => ({ type: 'OUTPUT_OPTION_UPDATED', option });

const initState = {
  isInitializing: false,
  isPlayerEnabled: false,
  isChromecast: false,
  isFullscreenEnabled: false,
};

const handlers = {
  LOADING_SCREEN_TOGGLED: (state) => ({ ...state, isInitializing: !state.isInitializing }),
  PLAYER_TOGGLED: (state) => ({ ...state, isPlayerEnabled: !state.isPlayerEnabled }),
  FULLSCREEN_TOGGLED: (state) => ({ ...state, isFullscreenEnabled: !state.isFullscreenEnabled }),
  OUTPUT_OPTION_UPDATED: (state, action) => ({ ...state, isChromecast: action.option }),
};

export const appReducer = createReducer(initState, handlers);
