

import axiosInstance from "../../AxiosInstance/axiosinstance"

import { LOGIN_SUCCESS, LOGOUT, SET_LOADING, SET_ERROR,SET_ID,SET_PERMISSIONS_FIRST } from '../types';

export const login = (username, password) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });

  try {
    const response = await axiosInstance.post('/login', { username, password });
    const { authorization,id,permissions } = response.data;
    //console.log('kaka:', permissions)

    localStorage.setItem('Butterfly_matrimony_token', authorization);

    dispatch({ type: SET_ID, payload: id });
    dispatch({ type: SET_PERMISSIONS_FIRST, payload: permissions });
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    return Promise.resolve(response.data);
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: 'Invalid credentials' });
    return Promise.reject(error);
  } finally {
    dispatch({ type: SET_LOADING, payload: false });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('Butterfly_matrimony_token');
  dispatch({ type: LOGOUT });
};


export const restoreSession = () => async (dispatch) => {
  const token = localStorage.getItem('Butterfly_matrimony_token');

  if (token) {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await axiosInstance.get('/verify-session');
      const { id, permissions } = response.data;
      
      dispatch({ type: LOGIN_SUCCESS, payload: response.data });
      dispatch({ type: SET_ID, payload: id });
      dispatch({ type: SET_PERMISSIONS_FIRST, payload: permissions });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: 'Session verification failed' });
      dispatch(logout());
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  }
};
