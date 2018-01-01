export const toggleFileBrowserDialog = () => ({ type: 'TOGGLE_FILEBROWSER_DIALOG' });

export const fetchContent = (dir, nav = '') => {
  return (dispatch) => {
    dispatch({ type: 'FETCH_DIR_PENDING' });
    return fetch(`/api/navigation?dir=${dir}&nav=${nav}`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Failed to fetch directory content');
      })
      .then((data) => {
        dispatch({ type: 'FETCH_DIR_FULFILLED', payload: data });
        return data;
      })
      .catch((err) => {
        dispatch({ type: 'FETCH_DIR_REJECTED', payload: err });
        return err;
      });
  };
};