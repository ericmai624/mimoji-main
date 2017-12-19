export const updateVideoUrl = (payload) => ({ 
  type: 'UPDATE_VIDEO_URL', payload 
});

export const updateVideoCurrTime = (time) => ({
  type: 'UPDATE_VIDEO_CURRENTTIME', payload: time
});

export const updateVideoDuration = (duration) => ({
  type: 'UPDATE_VIDEO_DURATION', payload: duration
});

export const togglePauseVideo = () => ({
  type: 'TOGGLE_PAUSE_VIDEO'
});
