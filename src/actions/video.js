export const updateVideoSrc = (path, type) => {
  return { type: 'UPDATE_VIDEO_SRC', payload: { path, type } };
};