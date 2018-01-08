import { createReducer } from '../utils';

export const genTextTrackId = (input) => {
  return dispatch => {
    dispatch({ type: 'GENERATE_TEXTTRACK_ID_PENDING' });
    return fetch('/api/stream/subtitle', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('failed to generate text track id');
      })
      .then(id => {
        let { location, offset, encoding, label } = input;
        dispatch({ type: 'GENERATE_TEXTTRACK_ID_FULFILLED', payload: { id, location, offset, encoding, label } });
      })
      .catch(error => {
        dispatch({ type: 'GENERATE_TEXTTRACK_ID_REJECTED', error });
      });
  };
};

export const resetTextTrack = () => ({ type: 'TEXTTRACK_RESETS' });

const initState = {
  id: '',
  location: '',
  offset: 0,
  label: '',
  encoding: 'auto',
  isEnabled: false
};

const handlers = {
  GENERATE_TEXTTRACK_ID_PENDING: state => ({ ...state, isEnabled: false }),
  GENERATE_TEXTTRACK_ID_FULFILLED: (state, action) => {
    let { id, location, offset, encoding, label } = action.payload;
    return { ...state, isEnabled: true, id, location, offset, encoding, label };
  },
  GENERATE_TEXTTRACK_ID_REJECTED: state => ({ ...state, isEnabled: false }),
  TEXTTRACK_RESETS: () => initState
};

export const textTrackReducer = createReducer(initState, handlers);