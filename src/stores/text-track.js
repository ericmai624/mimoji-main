import { createReducer } from '../utils';

export const updateTextTrackId = (id, label) => ({ type: 'TEXTTRACK_CREATED', payload: { id, label } });

export const changeTextTrackOffset = offset => ({ type: 'TEXTTRACK_OFFSET_CHANGED', offset });

export const changeTextTrackEncoding = encoding => ({ type: 'TEXTTRACK_ENCODING_CHANGED', encoding });

export const resetTextTrack = () => ({ type: 'TEXTTRACK_RESETS' });

const initState = {
  id: '',
  location: '',
  offset: 0,
  label: '',
  encoding: 'auto-detect',
  isEnabled: false
};

const handlers = {
  TEXTTRACK_CREATED: (state, action) => ({ ...state, id: action.payload.id, label: action.payload.label, isEnabled: true }),
  TEXTTRACK_OFFSET_CHANGED: (state, action) => ({ ...state, offset: action.offset }),
  TEXTTRACK_ENCODING_CHANGED: (state, action) => ({ ...state, encoding: action.encoding }),
  TEXTTRACK_RESETS: () => initState
};

export const textTrackReducer = createReducer(initState, handlers);