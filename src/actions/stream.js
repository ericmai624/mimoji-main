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

export const updateVideoCurrTime = (time) => ({
  type: 'UPDATE_VIDEO_CURRENTTIME', payload: time
});

export const updateVideoVolume = (volume) => ({
  type: 'UPDATE_VIDEO_VOLUME', payload: volume
});

export const updateVideoCC = (ccPath) => ({
  type: 'UPDATE_VIDEO_CC', payload: ccPath
});
