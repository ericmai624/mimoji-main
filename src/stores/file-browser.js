import { createReducer } from '../utils';

export const updateContent = (error, data) => ({ type: 'CONTENT_UPDATED', payload: { error, data } });

export const modifyDisplayedContent = modifiedContent => ({ type: 'CONTENT_MODIFIED', displayedContent: modifiedContent });

export const toggleFileBrowserDialog = () => ({ type: 'FILEBROWSER_DIALOG_TOGGLED' });

const initState = {
  isVisible: false,
  directory: null,
  content: [],
  displayedContent: [],
  hasError: false
};

const handlers = {
  CONTENT_UPDATED: (state, action) => {
    if (action.payload.error) {
      return { ...state, hasError: true };
    }
    const { directory, content } = action.payload.data;
    return { ...state, directory, content, displayedContent: content };
  },
  CONTENT_MODIFIED: (state, action) => ({ ...state, displayedContent: action.displayedContent }), 
  FILEBROWSER_DIALOG_TOGGLED: (state) => ({ ...state, isVisible: !state.isVisible })
};

export const fileBrowserReducer = createReducer(initState, handlers);