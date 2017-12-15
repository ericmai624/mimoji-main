const initState = {
  fetching: false,
  fetched: false,
  curr: '',
  list: [],
  error: null
};

export const dirReducer = (state=initState, action) => {
  switch (action.type) {
    case 'FETCH_DIR_PENDING':
      return { ...state, fetching: true };
    case 'FETCH_DIR_FULFILLED':
      return { ...state, fetching: false, fetched: true, curr: action.payload.dir, list: action.payload.list };
    case 'FETCH_DIR_REJECTED':
      return { ...state, fetching: false, fetched: false, error: action.payload };
    default: 
      return state;
  }
};
