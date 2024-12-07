import axiosInstance from "../../AxiosInstance/axiosinstance";
export const SET_DATA = "SET_DATA";
export const SET_PROFILE = "SET_PROFILE";
export const SET_USER_JOIN_STATS = "SET_USER_JOIN_STATS";


export const setData = (data) => ({
  type: SET_DATA,
  payload: data,
});

export const setProfile = (profile) => ({
  type: SET_PROFILE,
  payload: profile,
});
export const setUserJoinStats = (data) => ({
  type: SET_USER_JOIN_STATS,
  payload: data,
});


export const fetchProfileData = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get("/getMatches");

      dispatch(setProfile(response.data));
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
};

export const fetchUserJoinStats = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get("/userJoinStats");

      const userJoinData = response.data;
      // Initialize an array with 12 zero values, one for each month
      //console.log(userJoinData, 'asolei ki data asse re vai')
      const monthlyUserData = Array(12).fill(0);

      // Fill the array with actual data
      userJoinData.forEach((item) => {
        monthlyUserData[item.month - 1] = item.total; 
      });
      const updatedData = {
        labels: [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        datasets: [
          {
            label: "Users Joined",
            data: monthlyUserData,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      };

      dispatch(setData(updatedData));
    } catch (error) {
      console.error("Error fetching user join stats:", error);
    }
  };
};

