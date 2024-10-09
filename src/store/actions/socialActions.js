
import axiosInstance from "../../AxiosInstance/axiosinstance";

export const FETCH_SOCIAL_DETAILS = "FETCH_SOCIAL_DETAILS";
export const SELECT_ICON = "SELECT_ICON";
export const UPDATE_SOCIAL_DETAIL = "UPDATE_SOCIAL_DETAIL";
export const SET_UPDATE_STATUS = "SET_UPDATE_STATUS";

export const fetchSocialDetails = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("all_contacts_links");
    console.log('this is response:',response)
    dispatch({
      type: FETCH_SOCIAL_DETAILS,
      payload: response.data,
    });
  } catch (error) {
    console.error("Error fetching social details", error);
  }
};

export const selectIcon = (icon) => ({
  type: SELECT_ICON,
  payload: icon,
});

export const updateSocialDetail = (icon, value) => async (dispatch) => {
  dispatch({ type: SET_UPDATE_STATUS, payload: "loading" });

  try {
    await axiosInstance.post("", { icon, value });
    dispatch({ type: UPDATE_SOCIAL_DETAIL, payload: { icon, value } });
    dispatch({ type: SET_UPDATE_STATUS, payload: "done" });

    setTimeout(() => {
      dispatch({ type: SET_UPDATE_STATUS, payload: "" });
    }, 2000);
  } catch (error) {
    console.error("Error updating social detail", error);
    dispatch({ type: SET_UPDATE_STATUS, payload: "failed" });

    setTimeout(() => {
      dispatch({ type: SET_UPDATE_STATUS, payload: "" });
    }, 2000);
  }
};
