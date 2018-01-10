import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { castReducer } from './cast';
import { streamReducer } from './stream';
import { appReducer } from './app';
import { fileBrowserReducer } from './file-browser';
import { textTrackReducer } from './text-track';
import { ipReducer } from './ip';

const reducer = combineReducers({
  ip: ipReducer,
  app: appReducer,
  cast: castReducer,
  stream: streamReducer,
  textTrack: textTrackReducer,
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
