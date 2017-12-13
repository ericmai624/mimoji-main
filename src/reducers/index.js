import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { playerReducer } from './player';

const reducer = combineReducers({
  player: playerReducer
});

export const store = createStore(reducer, applyMiddleware(logger, thunk));