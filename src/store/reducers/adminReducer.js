
import {
    FETCH_ADMINS_SUCCESS,
    CREATE_ADMIN_SUCCESS,
    UPDATE_ADMIN_PERMISSIONS_SUCCESS,
    DELETE_ADMIN_SUCCESS,
    SET_SELECTED_ADMIN,
    SET_SELECTED_PERMISSIONS,
    SET_LOADING,
    SET_MESSAGE,
  } from '../actions/adminActions';
  
  const initialState = {
    admins: [],
    selectedAdmin: null,
    selectedPermissions: [],
    loading: false,
    message: '',
  };
  
  const adminReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_ADMINS_SUCCESS:
        return {
          ...state,
          admins: action.payload,
        };
      case CREATE_ADMIN_SUCCESS:
        return {
          ...state,
          message: 'Admin created successfully',
        };
      case UPDATE_ADMIN_PERMISSIONS_SUCCESS:
        return {
          ...state,
          message: 'Permissions updated successfully',
        };
      case DELETE_ADMIN_SUCCESS:
        return {
          ...state,
          message: 'Admin deleted successfully',
        };
      case SET_SELECTED_ADMIN:
        return {
          ...state,
          selectedAdmin: action.payload,
        };
      case SET_SELECTED_PERMISSIONS:
        return {
          ...state,
          selectedPermissions: action.payload,
        };
      case SET_LOADING:
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
  
  export default adminReducer;
  