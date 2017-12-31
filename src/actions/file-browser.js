import axios from 'axios';

export const toggleFileBrowserDialog = () => ({ type: 'TOGGLE_FILEBROWSER_DIALOG' });

export const fetchContent = (dir, nav = '') => {
  return (dispatch) => {
    dispatch({ type: 'FETCH_DIR_PENDING' });
    return axios.get(`/api/navigation?dir=${dir}&nav=${nav}`)
      .then((response) => {
        dispatch({ type: 'FETCH_DIR_FULFILLED', payload: response.data });
        return response;
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_DIR_REJECTED', payload: err });
        return err;
      });
  };
};