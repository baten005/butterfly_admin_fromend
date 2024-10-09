import {
  SET_TESTIMONIALS,
  FETCH_TESTIMONIALS_REQUEST,
  FETCH_TESTIMONIALS_SUCCESS,
  FETCH_TESTIMONIALS_FAILURE,
  ADD_TESTIMONIAL,
  EDIT_TESTIMONIAL,
  DELETE_TESTIMONIAL,
} from "../actions/testimonialActions";

const initialState = {
  testimonials: [],
  loading: false,
  error: null,
};

const testimonialReducers = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TESTIMONIALS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_TESTIMONIALS_SUCCESS:
      return {
        ...state,
        testimonials: action.payload,
        loading: false,
      };
    case FETCH_TESTIMONIALS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SET_TESTIMONIALS:
      return {
        ...state,
        testimonials: action.payload,
      };
    case ADD_TESTIMONIAL:
      return {
        ...state,
        testimonials: [...state.testimonials, action.payload],
      };
    case EDIT_TESTIMONIAL:
      return {
        ...state,
        testimonials: state.testimonials.map((testimonial) =>
          testimonial.id === action.payload.id ? action.payload : testimonial
        ),
      };
    case DELETE_TESTIMONIAL:
      return {
        ...state,
        testimonials: state.testimonials.filter(
          (testimonial) => testimonial.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default testimonialReducers;
