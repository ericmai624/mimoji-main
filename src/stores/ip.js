import { createReducer } from '../utils';

export const getIpAddress = () => {
  return dispatch => {
    dispatch({ type: 'GET_IP_PENDING' });
    return fetch('/api/networkinterface')
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('failed to get ip address');
      })
      .then(address => {
        dispatch({ type: 'GET_IP_FULFILLED', address });
      })
      .catch(err => {
        dispatch({ type: 'GET_IP_REJECTED', error: err });
      });
  };
};

const initState = {
  address: null,
  pending: false,
  error: null
};

const handlers = {
  GET_IP_PENDING: (state) => ({ ...state, pending: true }),
  GET_IP_FULFILLED: (state, action) => ({ ...state, address: action.address, pending: false }),
  GET_IP_REJECTED: (state, action) => ({ ...state, pending: false, error: action.error })
};

export const ipReducer = createReducer(initState, handlers);