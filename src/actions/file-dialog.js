import axios from 'axios';

export const toggleFileDialog = () => {
  return { type: 'TOGGLE_DIALOG' };
};

export const fetchDirList = (dir) => {
  return (dispatch) => {
    dispatch({ type: 'FETCH_DIR_PENDING' });
    return axios.get(`/api/navigation?dir=${dir}`)
      .then((response) => {
        console.log(response.data);
        dispatch({ type: 'FETCH_DIR_FULFILLED', payload: response.data });
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_DIR_REJECTED', payload: err });
      });
  }
}