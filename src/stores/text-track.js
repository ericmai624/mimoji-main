import { createReducer } from '../utils';

export const updateTextTrack = (payload) => ({ type: 'TEXTTRACK_UPDATES', payload });

export const resetTextTrack = () => ({ type: 'TEXTTRACK_RESETS' });

const initState = {
  path: '',
  offset: 0,
  encoding: 'auto',
  label: '',
  isEnabled: false
};

const handlers = {
  TEXTTRACK_UPDATES: (state, action) => action.payload,
  TEXTTRACK_RESETS: () => initState
};

export const textTrackReducer = createReducer(initState, handlers);