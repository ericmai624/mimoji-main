import { createReducer } from '../utils';

export const requestContent = (data) => ({ type: 'REQUEST_CONTENT_RETURNED', payload: data });

export const toggleFileBrowserDialog = () => ({ type: 'FILEBROWSER_DIALOG_TOGGLED' });

const initState = {
  isVisible: false,
  directory: '',
  content: [],
  hasError: false
};

const handlers = {
  REQUEST_CONTENT_RETURNED: (state, action) => {
    if (action.payload.error) {
      return { ...state, hasError: true };
    }
    const { directory, content } = action.payload.data;
    return { ...state, directory, content };
  },
  FILEBROWSER_DIALOG_TOGGLED: (state) => ({ ...state, isVisible: !state.isVisible })
};

export const fileBrowserReducer = createReducer(initState, handlers);