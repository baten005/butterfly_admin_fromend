import axiosInstance from "../../AxiosInstance/axiosinstance"
export const SET_ACTIVE_USERS = "SET_ACTIVE_USERS";
export const SET_EXPIRED_USERS = "SET_EXPIRED_USERS";
export const FETCH_USERS_ERROR = "FETCH_USERS_ERROR";
export const setActiveUsers = (activeUsers) => ({
  type: SET_ACTIVE_USERS,
  payload: activeUsers,
});

export const setExpiredUsers = (expiredUsers) => ({
  type: SET_EXPIRED_USERS,
  payload: expiredUsers,
});

export const fetchUsersError = (error) => ({
  type: FETCH_USERS_ERROR,
  payload: error,
});
export const fetchUsers = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get("/getUsers");
      const users = response.data;

      //console.log('Response data:', users); 
      const activeUsers = users.filter((user) => user.det === 'Active');
      const expiredUsers = users.filter((user) => user.det !== 'Active'); 

      //console.log('Active Users:', activeUsers); 
      //console.log('Expired Users:', expiredUsers); 
      dispatch(setActiveUsers(activeUsers));
      dispatch(setExpiredUsers(expiredUsers));
    } catch (error) {
      dispatch(fetchUsersError(error.message));
    }
  };
};
