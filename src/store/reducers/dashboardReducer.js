import { SET_DATA, SET_PROFILE } from "../actions/dashboardActions";

const initialState = {
  data: {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "data-1",
        data: [3000, 4000, 6000, 8000, 9000, 10000, 11000, 8000, 7000, 5000, 4000, 3000],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  },
  profile: [],
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        data: action.payload,
      };
    case SET_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    default:
      return state;
  }
};

export default dashboardReducer;