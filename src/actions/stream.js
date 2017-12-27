import axios from 'axios';
import { toUpper } from 'lodash';
export const getStreamInfo = (path, seek) => {
  return (dispatch) => {
    dispatch({ type: 'GET_STREAM_INFO_PENDING' });
    return axios.get(`/api/stream/process?v=${path}&s=${seek}`)
      .then((response) => {
        const { id, source, duration } = response.data;
        dispatch({ type: 'GET_STREAM_INFO_FULFILLED', payload: { id, source, duration, path, seek } });
        return response.data;
      })
      .catch((err) => {
        dispatch({ type: 'GET_STREAM_INFO_REJECTED', payload: err });
        return err;
      });
  }
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

export const updateStreamSub = (path) => ({
  type: 'UPDATE_STREAM_SUBTITLE', payload: path
});
