import { SET_MALE, SET_FEMALE } from "../actions/matchingActions";

const initialState = {
  male: [],     
  female: [],   
};

const matchingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MALE:
      return {
        ...state,
        male: action.payload,
      };
    case SET_FEMALE:
      return {
        ...state,
        female: action.payload,
      };
    default:
      return state;
  }
};

export default matchingReducer;
