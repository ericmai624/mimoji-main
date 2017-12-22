import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { castPlayerReducer, castControllerReducer } from './cast';
import { videoReducer } from './video';
import { playerReducer } from './player';
import { fileBrowserReducer } from './file-browser';

const reducer = combineReducers({
  cast: castPlayerReducer,
  controller: castControllerReducer,
  video: videoReducer,
  player: playerReducer,
  fileBrowser: fileBrowserReducer,
});

const middlewares = [thunk];

if (process.env.NODE_ENV !== 'production') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

export const store = createStore(reducer, applyMiddleware(...middlewares));