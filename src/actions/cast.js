export const updateCastPlayer = (player) => {
  return { type: 'INIT_CASTPLAYER', payload: player };
};

export const updateCastController = (controller) => {
  return { type: 'INIT_CASTCONTROLLER', payload: controller };
};