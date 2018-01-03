import { createReducer } from '../utils';

export const fetchContent = (dir, nav = '') => {
  return (dispatch) => {
    dispatch({ type: 'FETCH_CONTENT_PENDING' });
    return fetch(`/api/navigation?dir=${dir}&nav=${nav}`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Failed to fetch directory content');
      })
      .then((data) => {
        dispatch({ type: 'FETCH_CONTENT_FULFILLED', payload: data });
        return data;
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_CONTENT_REJECTED' });
      });
  };
};

export const toggleFileBrowserDialog = () => ({ type: 'FILEBROWSER_DIALOG_TOGGLED' });

const initState = {
  showDialog: false,
  currDir: '',
  content: [],
  fetching: false,
  fetched: false,
  hasError: false
};

const handlers = {
  FETCH_CONTENT_PENDING: (state, action) => ({ ...state, fetching: true, hasError: false }),
  FETCH_CONTENT_FULFILLED: (state, action) => {
    const { currDir, content } = action.payload; 
    return { ...state, fetching: false, fetched: true, currDir, content };
  },
  FETCH_CONTENT_REJECTED: (state, action) => ({ ...state, fetching: false, fetched: false, hasError: true }),
  FILEBROWSER_DIALOG_TOGGLED: (state) => ({ ...state, showDialog: !state.showDialog })
};

export const fileBrowserReducer = createReducer(initState, handlers);