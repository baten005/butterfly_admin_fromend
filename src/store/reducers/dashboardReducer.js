import { SET_DATA, SET_PROFILE, SET_USER_JOIN_STATS } from "../actions/dashboardActions";

const initialState = {
  data: {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Users Joined",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
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
    case SET_USER_JOIN_STATS: // New case for user join stats
      return {
        ...state,
        data: {
          ...state.data,
          datasets: [
            {
              ...state.data.datasets[0],
              data: action.payload.datasets[0].data, // Update the data with the new values
            },
          ],
        },
      };
    default:
      return state;
  }
};

export default dashboardReducer;
