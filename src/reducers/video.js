const initState = {
  id: '',
  source: '',
  path: '',
  seek: 0,
  currentTime: 0,
  duration: 0,
  paused: false,
  fullscreen: false,
  volumn: 100,
  cc: null,
  fetching: false,
  fetched: false,
  error: null
};

export const videoReducer = (state=initState, action) => {
  switch (action.type) {
    case 'GET_STREAM_INFO_PENDING':
      return { ...state, fetching: true };
    case 'GET_STREAM_INFO_FULFILLED':
      const { id, source, duration, path, seek } = action.payload;
      return { ...state, id, source, duration, path, seek, fetched: true, fetching: false };
    case 'GET_STREAM_INFO_REJECTED':
      return { ...state, fetching: false, fetched: false, error: action.payload };
    case 'UPDATE_VIDEO_CURRENTTIME':
      return { ...state, currentTime: action.payload };
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
