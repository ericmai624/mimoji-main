const initState = {
  showPlayer: false,
  showControls: false,
  showSubSettings: false
};

export const playerReducer = (state = initState, action) => {
  switch (action.type) {
  case 'TOGGLE_PLAYER_MAIN':
    return { ...state, showPlayer: !state.showPlayer };
  case 'TOGGLE_PLAYER_CONTROLS':
    return { ...state, showControls: !state.showControls };
  case 'TOGGLE_PLAYER_SUBSETTINGS':
    return { ...state, showSubSettings: !state.showSubSettings };
  default:
    return state;
  }
};