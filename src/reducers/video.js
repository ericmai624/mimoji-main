const initState = {
  path: '',
  seekTime: 0,
  currentTime: 0,
  duration: 0,
  paused: false,
  fullscreen: false,
  volumn: 100,
  cc: null
};

export const videoReducer = (state=initState, action) => {
  switch (action.type) {
    case 'UPDATE_VIDEO_URL':
      return {
        ...state,
        path: action.payload.path,
        seekTime: action.payload.seekTime
      };
    case 'UPDATE_VIDEO_CURRENTTIME':
      return { ...state, currentTime: action.payload };
    case 'UPDATE_VIDEO_DURATION':
      return { ...state, duration: action.payload };
    case 'TOGGLE_PAUSE_VIDEO':
      return { ...state, paused: !state.paused };
    case 'TOGGLE_FULLSCREEN':
      return { ...state, fullscreen: !state.fullscreen };
    case 'UPDATE_VIDEO_VOLUMN':
      return { ...state, volumn: action.payload };
    case 'UPDATE_VIDEO_CC':
      return { ...state, cc: action.payload };
    default:
      return state;
  }
};
