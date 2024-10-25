import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../AxiosInstance/axiosinstance";
export const FETCH_CONTACT_DETAILS = 'FETCH_CONTACT_DETAILS';
export const SELECT_CONTACT = 'SELECT_CONTACT';
export const UPDATE_CONTACT = 'UPDATE_CONTACT';
export const SET_LOADING_SOCIAL = 'SET_LOADING_SOCIAL';
export const SET_ERROR = 'SET_ERROR';
export const SET_SUCCESS = 'SET_SUCCESS';


export const fetchContactDetails = () => async (dispatch) =>  {
    const data=await axiosInstance.get('/all_contacts_links');
    //console.log('this is contact',data.data.contactItem);
    dispatch({type:FETCH_CONTACT_DETAILS,payload:data.data})
};

export const selectContact = (type, name) => {
  return {
    type: SELECT_CONTACT,
    payload: { type, name },
  };
};

export const updateContact = (type, name, value) => async (dispatch) => {
  dispatch({ type: SET_LOADING_SOCIAL,payload:true });
  //console.log(type,name,value)
  try {
    const res=await axiosInstance.post('/update_links',{type,name,value});
    fetchContactDetails();
    dispatch({
      type: UPDATE_CONTACT,
      payload: { type, name, value },
    });

    dispatch({ type: SET_SUCCESS });
    //alert("Update successful!");
    toast.success("Update successful!");
  } catch (error) {
    dispatch({ type: SET_ERROR });
    //alert("Update failed!");
    toast.error("Update failed!");
  }
};
