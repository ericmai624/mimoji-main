import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

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

export const store = createStore(reducer, applyMiddleware(thunk, logger));