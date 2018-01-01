import { toUpper } from 'lodash';

export const getStreamInfo = (path, seek) => {
  return (dispatch) => {
    dispatch({ type: 'GET_STREAM_INFO_PENDING' });
    return fetch(`/api/stream/process?v=${path}&s=${seek}`)
      .then((response) => {
        if (response.ok) return response.json();
        throw response;
      })
      .then((data) => {
        const { id, source, duration } = data;
        dispatch({ type: 'GET_STREAM_INFO_FULFILLED', payload: { id, source, duration, path, seek } });
        return data;
      })
      .catch((err) => {
        dispatch({ type: 'GET_STREAM_INFO_REJECTED', payload: err });
        return err;
      });
  };
};

export const toggleStreamProps = (prop) => ({
  type: `TOGGLE_STREAM_${toUpper(prop)}`
});

export const updateStreamTime = (time) => ({
  type: 'UPDATE_STREAM_TIME', payload: time
});

export const updateStreamVolume = (volume) => ({
  type: 'UPDATE_STREAM_VOLUME', payload: volume
});

export const updateStreamSub = (payload) => ({
  type: 'UPDATE_STREAM_SUBTITLE', payload
});
