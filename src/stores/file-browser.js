import { createReducer } from '../utils';

export const updateContent = (data, error) => ({ type: 'CONTENT_UPDATED', payload: { data, error } });

export const togglePending = () => ({ type: 'CONTENT_REQUEST_PENDING' });

export const toggleFileBrowserDialog = () => ({ type: 'FILEBROWSER_DIALOG_TOGGLED' });

const initState = {
  isVisible: false,
  directory: '',
  content: [],
  isPending: false,
  hasError: false
};

const handlers = {
  CONTENT_UPDATED: (state, action) => {
    if (action.payload.error) {
      return { ...state, hasError: true };
    }
    const { directory, content } = action.payload.data;
    return { ...state, directory, content };
  },
  CONTENT_REQUEST_PENDING: (state) => ({ ...state, isPending: !state.isPending }),
  FILEBROWSER_DIALOG_TOGGLED: (state) => ({ ...state, isVisible: !state.isVisible })
};

export const fileBrowserReducer = createReducer(initState, handlers);