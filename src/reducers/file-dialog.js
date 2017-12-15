const initState = false;

export const fileDialogReducer = (state=initState, action) => {
  switch (action.type) {
    case 'TOGGLE_DIALOG':
      return !state;
    default: 
      return state;
  }
};