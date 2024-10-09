import axiosInstance from '../../AxiosInstance/axiosinstance';

export const FETCH_SUCCESS_LIST = 'FETCH_SUCCESS_LIST';
export const UPDATE_SUCCESS_LIST = 'UPDATE_SUCCESS_LIST';
export const SET_LOADING_SUCCESS = 'SET_LOADING_SUCCESS';
export const SET_MESSAGE = 'SET_MESSAGE';

export const fetchSuccessList = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get('/getSuccessList');
    dispatch({
      type: FETCH_SUCCESS_LIST,
      payload: response.data,
    });
  } catch (error) {
    console.error('Error fetching success list:', error);
  }
};

export const updateSuccessList = (count, text) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axiosInstance.post('/updateSuccessList', { count, text });
    dispatch({
      type: UPDATE_SUCCESS_LIST,
    });
    dispatch(fetchSuccessList());
    dispatch(setMessage('Success! List updated.'));
  } catch (error) {
     dispatch(setMessage('Error updating success list.'));
     console.error('Error updating success list:', error);
   
  } finally {
    dispatch(setLoading(false));
  }
};

export const setLoading = (loading) => ({
  type: SET_LOADING_SUCCESS,
  payload: loading,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message,
});
