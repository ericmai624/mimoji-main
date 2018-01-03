import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { castPlayerReducer, castControllerReducer } from './cast';
import { streamReducer } from './stream';
import { appReducer } from './app';
import { fileBrowserReducer } from './file-browser';
import { subtitleReducer } from './subtitle';

const reducer = combineReducers({
  app: appReducer,
  cast: castPlayerReducer,
  controller: castControllerReducer,
  stream: streamReducer,
  subtitle: subtitleReducer,
  fileBrowser: fileBrowserReducer,
});

const middlewares = [thunk];

if (process.env.NODE_ENV !== 'production') {
  const { createLogger } = require('redux-logger');
  middlewares.push(createLogger({
    predicate: (getState, action) => action.type !== 'UPDATE_STREAM_TIME'
  }));
}

export const store = createStore(reducer, applyMiddleware(...middlewares));
