import { createReducer } from '../utils';

export const setTextTrackInfo = (info) => ({ type: 'TEXTTRACK_CREATED', info });

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
  TEXTTRACK_CREATED: (state, action) => { 
    const { id, label, location } = action.info;
    return {...state, id, label, location, isEnabled: true };
  },
  TEXTTRACK_OFFSET_CHANGED: (state, action) => ({ ...state, offset: action.offset }),
  TEXTTRACK_ENCODING_CHANGED: (state, action) => ({ ...state, encoding: action.encoding }),
  TEXTTRACK_RESETS: () => initState
};

export const textTrackReducer = createReducer(initState, handlers);