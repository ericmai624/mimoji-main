import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { castPlayerReducer, castControllerReducer } from './cast';
import { videoReducer } from './video';
import { playerReducer } from './player';
import { fileDialogReducer } from './file-dialog';
import { dirReducer } from './dir';

const reducer = combineReducers({
  cast: castPlayerReducer,
  controller: castControllerReducer,
  video: videoReducer,
  player: playerReducer,
  showFileDialog: fileDialogReducer,
  dir: dirReducer
});

export const store = createStore(reducer, applyMiddleware(thunk, logger));