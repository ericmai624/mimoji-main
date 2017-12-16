const initState = {
  path: '',
  showControls: false,
  showVideo: false
};

export const videoReducer = (state=initState, action) => {
  switch (action.type) {
    case 'UPDATE_VIDEO_SRC':
      return { ...state, path: action.payload, showControls: true, showVideo: true };
    case 'TOGGLE_VIDEO_CONTROLS':
      return { ...state, showControls: !state.showControls };
    default:
      return state;
  }
};
