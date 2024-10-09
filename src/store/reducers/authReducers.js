import {
  LOGIN_SUCCESS,
  LOGOUT,
  SET_LOADING,
  SET_ERROR,
  SET_ID,
  SET_PERMISSIONS_FIRST,
} from "../types";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  id: null,
  permissions:[],
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, isLoading: action.payload };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case LOGOUT:
      return { ...state, user: null, isAuthenticated: false };
    case SET_ID:
      return { ...state, id: action.payload };
    case SET_PERMISSIONS_FIRST:
      return { ...state, permissions: action.payload };
    default:
      return state;
  }
};

export default authReducer;
