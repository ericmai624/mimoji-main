import { createReducer } from '../utils';

export const genTextTrackId = ({ location, offset, encoding, label }) => {
  return dispatch => {
    dispatch({ type: 'GENERATE_TEXTTRACK_ID_PENDING' });
    return fetch('/api/stream/subtitle', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location })
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('failed to generate text track id');
      })
      .then(id => {
        dispatch({ type: 'GENERATE_TEXTTRACK_ID_FULFILLED', payload: { id, location, label } });
        if (offset) dispatch({ type: 'TEXTTRACK_OFFSET_CHANGED', offset });
        dispatch({ type: 'TEXTTRACK_ENCODING_CHANGED', encoding });
      })
      .catch(error => {
        dispatch({ type: 'GENERATE_TEXTTRACK_ID_REJECTED', error });
      });
  };
};

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
  GENERATE_TEXTTRACK_ID_PENDING: state => ({ ...state, isEnabled: false }),
  GENERATE_TEXTTRACK_ID_FULFILLED: (state, action) => {
    let { id, location, label } = action.payload;
    return { ...state, isEnabled: true, id, location, label };
  },
  GENERATE_TEXTTRACK_ID_REJECTED: state => ({ ...state, isEnabled: false }),
  TEXTTRACK_OFFSET_CHANGED: (state, action) => ({ ...state, offset: action.offset }),
  TEXTTRACK_ENCODING_CHANGED: (state, action) => ({ ...state, encoding: action.encoding }),
  TEXTTRACK_RESETS: () => initState
};

export const textTrackReducer = createReducer(initState, handlers);