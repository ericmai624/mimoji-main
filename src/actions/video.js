export const updateVideoSrc = (link) => ({ 
  type: 'UPDATE_VIDEO_SRC', payload: link 
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

export const toggleVideoControls = () => ({ 
  type: 'TOGGLE_VIDEO_CONTROLS' 
});