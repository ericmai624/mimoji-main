const initState = {
  id: '',
  source: '',
  path: '',
  seek: 0,
  currentTime: 0,
  duration: 0,
  paused: false,
  fullscreen: false,
  volume: 1,
  muted: false,
  subtitle: {
    enabled: true,
    path: '',
    offset: 0,
    lang: 'zh'
  },
  fetching: false,
  fetched: false,
  error: null
};

export const streamReducer = (state = initState, action) => {
  switch (action.type) {
  case 'GET_STREAM_INFO_PENDING':
    return { ...state, fetching: true };
  case 'GET_STREAM_INFO_FULFILLED':
    const { id, source, duration, path, seek } = action.payload;
    return { ...state, id, source, duration, path, seek, fetched: true, fetching: false };
  case 'GET_STREAM_INFO_REJECTED':
    return { ...state, fetching: false, fetched: false, error: action.payload };
  case 'UPDATE_STREAM_TIME':
    return { ...state, currentTime: action.payload };
  case 'TOGGLE_STREAM_PAUSE':
    return { ...state, paused: !state.paused };
  case 'TOGGLE_STREAM_FULLSCREEN':
    return { ...state, fullscreen: !state.fullscreen };
  case 'TOGGLE_STREAM_MUTED':
    return { ...state, muted: !state.muted };
  case 'UPDATE_STREAM_VOLUME':
    return { ...state, volume: action.payload };
  case 'UPDATE_STREAM_subtitle':
    return { ...state, subtitle: action.payload };
  default:
    return state;
  }
};
