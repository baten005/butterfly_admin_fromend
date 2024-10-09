import {
  FETCH_SUCCESS_LIST,
  UPDATE_SUCCESS_LIST,
  SET_LOADING_SUCCESS,
  SET_MESSAGE,
} from '../actions/successListActions';

const initialState = {
  successList: [],
  loading: false,
  message: '',
};

const successListReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS_LIST:
      return {
        ...state,
        successList: action.payload,
      };
    case UPDATE_SUCCESS_LIST:
      return {
        ...state,
        message: 'Updated Successfully', 
      };
    case SET_LOADING_SUCCESS:
      return {
        ...state,
        loading: action.payload, 
      };
    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload, 
      };
    default:
      return state;
  }
};

export default successListReducer;
