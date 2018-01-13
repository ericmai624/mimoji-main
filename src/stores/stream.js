import { createReducer } from '../utils';

export const setStreamSource = location => ({ type: 'STREAM_SOURCE_CHANGED', location });

export const updateStreamInfo = data => ({ type: 'STREAM_INFO_UPDATED', payload: data });

export const updateStreamTime = (currentTime) => ({ type: 'STREAM_TIME_UPDATES', currentTime });

export const resetStream = () => ({ type: 'STREAM_RESETS' });

const initState = {
  id: '',
  video: '',
  currentTime: 0,
  duration: 0,
  hasError: false
};

const handlers = {
  STREAM_SOURCE_CHANGED: (state, action) => ({ ...state, video: action.location }),
  STREAM_INFO_UPDATED: (state, action) => ({ 
    ...state,
    id: action.payload.id,
    duration: action.payload.duration
  }),
  STREAM_TIME_UPDATES: (state, action) => ({ ...state, currentTime: action.currentTime }),
  STREAM_RESETS: () => initState
};

export const streamReducer = createReducer(initState, handlers);
