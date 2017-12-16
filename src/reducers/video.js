const initState = {
  path: '',
  showVideo: false
};

export const videoReducer = (state=initState, action) => {
  switch (action.type) {
    case 'UPDATE_VIDEO_SRC':
      const path = action.payload;
      const showVideo = true;
      return { ...state, path, showVideo };
    default:
      return state;
  }
};