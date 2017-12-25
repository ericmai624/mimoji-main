import axios from 'axios';

export const getVideoStreamInfo = (path, seek) => {
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

export const updateVideoCurrTime = (time) => ({
  type: 'UPDATE_VIDEO_CURRENTTIME', payload: time
});

export const togglePauseVideo = () => ({
  type: 'TOGGLE_PAUSE_VIDEO'
});

export const toggleVideoFullscreen = () => ({
  type: 'TOGGLE_FULLSCREEN'
});

export const updateVideoVolumn = (volumn) => ({
  type: 'UPDATE_VIDEO_VOLUMN', payload: volumn
});

export const updateVideoCC = (ccPath) => ({
  type: 'UPDATE_VIDEO_CC', payload: ccPath
});
