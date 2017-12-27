import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { castPlayerReducer, castControllerReducer } from './cast';
import { streamReducer } from './stream';
import { playerReducer } from './player';
import { fileBrowserReducer } from './file-browser';

const reducer = combineReducers({
  cast: castPlayerReducer,
  controller: castControllerReducer,
  stream: streamReducer,
  player: playerReducer,
  fileBrowser: fileBrowserReducer,
});

const middlewares = [thunk];

if (process.env.NODE_ENV !== 'production') {
  const { createLogger } = require('redux-logger');
  middlewares.push(createLogger({
    collapsed: (getState, action) => action.type === 'UPDATE_STREAM_TIME'
  }));
}

export const store = createStore(reducer, applyMiddleware(...middlewares));