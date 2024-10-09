import {
    FETCH_CONTACT_DETAILS,
    SELECT_CONTACT,
    UPDATE_CONTACT,
    SET_LOADING_SOCIAL,
    SET_SUCCESS,
    SET_ERROR,
  } from "../actions/socialLinkUpdateActions";
  
  const initialState = {
    contactItem: {},
    companySocial: {},
    founderSocial: {},
    selected: { type: null, name: null },
    loading_social: false,
    error: false,
    success: false,
  };
  
  const socialLinkUpdateReducers = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_CONTACT_DETAILS:
        return {
          ...state,
          ...action.payload,
        };
      case SELECT_CONTACT:
        return {
          ...state,
          selected: action.payload,
        };
      case UPDATE_CONTACT:
        const { type, name, value } = action.payload;
        return {
          ...state,
          [type]: {
            ...state[type],
            [name]: value,
          },
          loading_social: false,
          success: true,
        };
      case SET_LOADING_SOCIAL:
        return { ...state, loading_social: action.payload, error: false, success: false };
      case SET_SUCCESS:
        return { ...state, loading_social: false, success: true };
      case SET_ERROR:
        return { ...state, loading_social: false, error: true };
      default:
        return state;
    }
  };
  
  export default socialLinkUpdateReducers;
  