import { createReducer } from '../utils';

export const changeSubtitle = (payload) => ({ type: 'SUB_CHANGES', payload });

const initState = {
  path: '',
  offset: 0,
  encoding: 'auto',
  label: '',
  isEnabled: false
};

const handlers = {
  SUB_CHANGES: ((state, action) => action.payload)
};

export const subtitleReducer = createReducer(initState, handlers);