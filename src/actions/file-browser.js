import axios from 'axios';

export const toggleFileBrowserDialog = () => {
  return { type: 'TOGGLE_FILEBROWSER_DIALOG' };
};

export const fetchDirContent = (dir) => {
  return (dispatch) => {
    dispatch({ type: 'FETCH_DIR_PENDING' });
    return axios.get(`/api/navigation?dir=${dir}`)
      .then((response) => {
        dispatch({ type: 'FETCH_DIR_FULFILLED', payload: response.data });
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_DIR_REJECTED', payload: err });
      });
  }
}