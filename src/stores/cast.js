import { createReducer } from '../utils';

export const updateCastPlayer = (player) => {
  return { type: 'INIT_CASTPLAYER', payload: player };
};

export const updateCastController = (controller) => {
  return { type: 'INIT_CASTCONTROLLER', payload: controller };
};

export const updateCastContext = context => ({ type: 'CAST_CONTEXT_CREATED', context });

export const updateCastSession = session => ({ type: 'CAST_SESSION_CHANGED', session });

const initState = {
  context: null,
  session: null
};

const handlers = {
  CAST_CONTEXT_CREATED: (state, action) => ({ ...state, context: action.context }),
  CAST_SESSION_CHANGED: (state, action) => ({ ...state, session: action.session })
};

export const castReducer = createReducer(initState, handlers);
