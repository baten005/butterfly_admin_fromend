import { SET_ACTIVE_USERS, SET_EXPIRED_USERS, FETCH_USERS_ERROR } from "../actions/userActions";

const initialState = {
  activeUsers: [],
  expiredUsers: [],
  error: null, 
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_USERS:
      return {
        ...state,
        activeUsers: action.payload,
      };
    case SET_EXPIRED_USERS:
      return {
        ...state,
        expiredUsers: action.payload,
      };
    case FETCH_USERS_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
