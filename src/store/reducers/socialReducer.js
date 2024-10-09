
import {
    FETCH_SOCIAL_DETAILS,
    SELECT_ICON,
    UPDATE_SOCIAL_DETAIL,
    SET_UPDATE_STATUS,
  } from "../actions/socialActions";
  
  const initialState = {
    details: {},
    selectedIcon: null,
    updateStatus: "",
  };
  
  const socialReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_SOCIAL_DETAILS:
        return { ...state, details: action.payload };
  
      case SELECT_ICON:
        return { ...state, selectedIcon: action.payload };
  
      case UPDATE_SOCIAL_DETAIL:
        return {
          ...state,
          details: {
            ...state.details,
            [action.payload.icon]: action.payload.value,
          },
          selectedIcon: null,
        };
  
      case SET_UPDATE_STATUS:
        return { ...state, updateStatus: action.payload };
  
      default:
        return state;
    }
  };
  
  export default socialReducer;
  