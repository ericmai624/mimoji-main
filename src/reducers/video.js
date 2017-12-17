const initState = {
  path: '',
  displayVideoControls: false,
  displayVideoPlayer: false,
  status: {
    paused: false,
    currentTime: 0,
    duration: 0
  }
};

export const videoReducer = (state=initState, action) => {
  const { status } = state;
  switch (action.type) {
    case 'UPDATE_VIDEO_SRC':
      return { ...state, path: action.payload, displayVideoControls: true, displayVideoPlayer: true };
    case 'UPDATE_VIDEO_CURRENTTIME':
      return { ...state, status: { ...status, currentTime: action.payload } };
    case 'UPDATE_VIDEO_DURATION':
      return { ...state, status: { ...status, duration: action.payload } };
    case 'TOGGLE_PAUSE_VIDEO':
      return { ...state, status: { ...status, paused: !status.paused } };
    case 'TOGGLE_VIDEO_CONTROLS':
      return { ...state, displayVideoControls: !state.displayVideoControls };
    default:
      return state;
  }
};
