const initState = {
  showPlayer: false,
  showControls: false
};

export const playerReducer = (state = initState, action) => {
  switch (action.type) {
  case 'TOGGLE_VIDEO_PLAYER':
    return { ...state, showPlayer: !state.showPlayer };
  case 'TOGGLE_VIDEO_CONTROLS':
    return { ...state, showControls: !state.showControls };
  default:
    return state;
  }
};