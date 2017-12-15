export const videoReducer = (state=null, action) => {
  switch (action.type) {
    case 'UPLOAD_VIDEO':
      return action.payload;
    default:
      return state;
  }
};