import { createReducer } from '../utils';

export const fetchStreamInfo = (path, seek = 0) => {
  return (dispatch) => {
    dispatch({ type: 'FETCH_STREAMINFO_PENDING' });
    return fetch(`/api/stream/process?v=${path}&s=${seek}`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        const { id, source, duration } = data;
        dispatch({ type: 'FETCH_STREAMINFO_FULFILLED', payload: { id, source, duration, path, seek } });
        return data;
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_STREAMINFO_REJECTED' });
      });
  };
};

export const updateStreamTime = (currentTime) => ({ type: 'STREAM_TIME_UPDATES', currentTime });

export const resetStream = () => ({ type: 'STREAM_RESETS' });

const initState = {
  id: '',
  source: '',
  path: '',
  currentTime: 0,
  duration: 0,
  fetching: false,
  fetched: false,
  hasError: false
};

const handlers = {
  FETCH_STREAMINFO_PENDING: (state, action) => ({ ...state, fetching: true, hasError: false }),
  FETCH_STREAMINFO_FULFILLED: (state, action) => {
    const { id, source, duration, path, seek } = action.payload;
    return { ...state, id, source, duration, path, seek, fetched: true, fetching: false };
  },
  FETCH_STREAMINFO_REJECTED: (state, action) => ({ ...state, fetching: false, fetched: false, hasError: true }),
  STREAM_TIME_UPDATES: (state, action) => ({ ...state, currentTime: action.currentTime }),
  STREAM_RESETS: () => initState
};

export const streamReducer = createReducer(initState, handlers);
