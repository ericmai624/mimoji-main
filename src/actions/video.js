export const updateVideoSrc = (link) => {
  return { type: 'UPDATE_VIDEO_SRC', payload: link };
};

export const toggleVideoControls = () => {
  return { type: 'TOGGLE_VIDEO_CONTROLS' };
};