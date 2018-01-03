export const updateCastPlayer = (player) => {
  return { type: 'INIT_CASTPLAYER', payload: player };
};

export const updateCastController = (controller) => {
  return { type: 'INIT_CASTCONTROLLER', payload: controller };
};

const initState = {};

export const castPlayerReducer = (state = initState, action) => {
  switch (action.type) {
  case 'INIT_CASTPLAYER':
    return action.payload;
  default:
    return state;
  }
};

export const castControllerReducer = (state = initState, action) => {
  switch (action.type) {
  case 'INIT_CASTCONTROLLER':
    return action.payload;
  default:
    return state;
  }
};