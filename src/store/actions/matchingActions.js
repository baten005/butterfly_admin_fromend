import axiosInstance from "../../AxiosInstance/axiosinstance";  // Use your configured axios instance

export const SET_MALE = "SET_MALE";
export const SET_FEMALE = "SET_FEMALE";

export const setMale = (male) => ({
  type: SET_MALE,
  payload: male,
});

export const setFemale = (female) => ({
  type: SET_FEMALE,
  payload: female,
});


export const fetchMatchingUsers = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get("/getUsers1");
    const users = response.data;

    //console.log('kaka match',users)
    const maleUsers = users.filter(user => user.det === 'Male');
    const femaleUsers = users.filter(user => user.det === 'Female');

    dispatch(setMale(maleUsers));   
    dispatch(setFemale(femaleUsers)); 
  } catch (error) {
    console.error("Error fetching matching users: ", error);
  }
};
