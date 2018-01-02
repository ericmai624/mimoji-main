const initState = {
  showPlayer: false,
  showControls: true,
  showSubSettings: false,
  isFullscreenEnabled: false
};

export const playerReducer = (state = initState, action) => {
  switch (action.type) {
  case 'TOGGLE_PLAYER_MAIN':
    return { ...state, showPlayer: !state.showPlayer };
  case 'TOGGLE_PLAYER_CONTROLS':
    return { ...state, showControls: !state.showControls };
  case 'TOGGLE_PLAYER_SUBSETTINGS':
    return { ...state, showSubSettings: !state.showSubSettings };
  case 'TOGGLE_PLAYER_FULLSCREEN':
    return { ...state, isFullscreenEnabled: !state.isFullscreenEnabled };
  default:
    return state;
  }
};