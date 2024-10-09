import {
  SET_IMAGE,
  setimage,
  SET_TEXT,
  settext,
  getText
} from "../actions/homePageImageActions";
const initialState = {
  image: {
    image: `https://backend.butterfly.hurairaconsultancy.com/uploads/landingCoverImage.webp`,
  },
  text: {
    text: ``,
  },
};

const HomePageImageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IMAGE:
      return {
        ...state,
        image: action.payload,
      };
    case SET_TEXT:
      return {
        ...state,
        text: action.payload,
      };
    default:
      return state;
  }
};

export default HomePageImageReducer;
