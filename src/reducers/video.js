const initState = {
  path: '',
  type: '',
  showVideo: false
};

export const videoReducer = (state=initState, action) => {
  switch (action.type) {
    case 'UPDATE_VIDEO_SRC':
      const { path, type } = action.payload;
      const showVideo = true;
      return { ...state, path, type, showVideo };
    default:
      return state;
  }
};