const initState = {
  showDialog: false,
  currDir: '',
  content: [],
  fetching: false,
  fetched: false,
  error: null
};

export const fileBrowserReducer = (state = initState, action) => {
  switch (action.type) {
  case 'FETCH_DIR_PENDING':
    return { ...state, fetching: true };
  case 'FETCH_DIR_FULFILLED':
    const { currDir, content } = action.payload; 
    return { ...state, fetching: false, fetched: true, currDir, content };
  case 'FETCH_DIR_REJECTED':
    return { ...state, fetching: false, fetched: false, error: action.payload };
  case 'TOGGLE_FILEBROWSER_DIALOG':
    return { ...state, showDialog: !state.showDialog };
  default: 
    return state;
  }
};