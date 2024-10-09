import axiosInstance from "../../AxiosInstance/axiosinstance";
export const SET_IMAGE = "SET_IMAGE";
export const SET_TEXT = "SET_TEXT";


export const setimage = (image) => ({
  type: SET_IMAGE,
  payload: image,
});

export const settext = (text) => ({
    type: SET_TEXT,
    payload: text,
  });

  export const getText = () => async (dispatch) => {
    try {
      const response = await axiosInstance.get("get_text");
      console.log('this is response ttttt:',response)
      dispatch({
        type: SET_TEXT,
        payload: response.data,
      });
    } catch (error) {
      console.error("Error fetching social details", error);
    }
  };

  export const updateText = (text) => async (dispatch) => {
    try {
      const response = await axiosInstance.post("update_text",{text});
      console.log('this is response ttttt:',response)
      dispatch(getText());
    } catch (error) {
      console.error("Error fetching social details", error);
    }
  };


  export const updateLandingImage = (image) => async (dispatch) => {
    const formData = new FormData();
    formData.append('image', image);
    console.log(image,formData)
    try {
      console.log('Starting deleteTestimonials with id:', image); 
      const response = await axiosInstance.post('/update_landing_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },});
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

