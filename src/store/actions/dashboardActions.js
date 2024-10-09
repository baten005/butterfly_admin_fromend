import axiosInstance from "../../AxiosInstance/axiosinstance";
export const SET_DATA = "SET_DATA";
export const SET_PROFILE = "SET_PROFILE";

export const setData = (data) => ({
  type: SET_DATA,
  payload: data,
});

export const setProfile = (profile) => ({
  type: SET_PROFILE,
  payload: profile,
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

