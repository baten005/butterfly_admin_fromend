import axiosInstance from "../../AxiosInstance/axiosinstance";

// Action Types
export const SET_TESTIMONIALS = 'SET_TESTIMONIALS';
export const FETCH_TESTIMONIALS_REQUEST = 'FETCH_TESTIMONIALS_REQUEST';
export const FETCH_TESTIMONIALS_SUCCESS = 'FETCH_TESTIMONIALS_SUCCESS';
export const FETCH_TESTIMONIALS_FAILURE = 'FETCH_TESTIMONIALS_FAILURE';
export const ADD_TESTIMONIAL = 'ADD_TESTIMONIAL';
export const EDIT_TESTIMONIAL = 'EDIT_TESTIMONIAL';
export const DELETE_TESTIMONIAL = 'DELETE_TESTIMONIAL';

// Action Creator for deleting a testimonial
export const deleteTestimonialSuccess = (id) => ({
  type: DELETE_TESTIMONIAL,
  payload: id,
});

// Action Creators
export const setTestimonials = (testimonials) => ({
  type: SET_TESTIMONIALS,
  payload: testimonials,
});

export const fetchTestimonialsRequest = () => ({
  type: FETCH_TESTIMONIALS_REQUEST,
});

export const fetchTestimonialsSuccess = (testimonials) => ({
  type: FETCH_TESTIMONIALS_SUCCESS,
  payload: testimonials,
});

export const fetchTestimonialsFailure = (error) => ({
  type: FETCH_TESTIMONIALS_FAILURE,
  payload: error,
});

// Async Action to Fetch Testimonials
export const fetchTestimonials = () => async (dispatch) => {
  dispatch(fetchTestimonialsRequest());
  try {
    const response = await axiosInstance.get('/testimonials'); 
    dispatch(fetchTestimonialsSuccess(response.data));
  } catch (error) {
    dispatch(fetchTestimonialsFailure(error.message));
  }
};

export const addTestimonial = (testimonial) => async (dispatch) => {
  try {
    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('name', testimonial.name);
    formData.append('content', testimonial.content);
    formData.append('designation', testimonial.designation);
    formData.append('company', testimonial.company);
    formData.append('image', testimonial.image); // Assuming testimonial.image is a File object

    const response = await axiosInstance.post('/addTestimonials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: ADD_TESTIMONIAL,
      payload: response.data,
    });
    dispatch(fetchTestimonials());
  } catch (error) {
    console.error("Error adding testimonial:", error);
  }
};

export const updateTestimonial = (testimonial) => async (dispatch) => {
  try {
    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('id', testimonial.id);
    formData.append('name', testimonial.name);
    formData.append('content', testimonial.content);
    formData.append('designation', testimonial.designation);
    formData.append('company', testimonial.company);

    ////console.log(formData,testimonial)
    if (testimonial.image) {
      formData.append('image', testimonial.image); // Append image if it exists
    }

    const response = await axiosInstance.post('/update_testimonial', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: EDIT_TESTIMONIAL,
      payload: response.data,
    });
    dispatch(fetchTestimonials());
  } catch (error) {
    console.error("Error updating testimonial:", error);
  }
};

export const deleteTestimonials = (id) => async (dispatch) => {
  try {
    ////console.log('Starting deleteTestimonials with id:', id);
    const response = await axiosInstance.post('/delete_testimonials', { id });
    ////console.log('Delete response:', response);
    dispatch(fetchTestimonials());
    ////console.log('Dispatching fetchTestimonials');
  } catch (error) {
    console.error("Error deleting testimonial:", error);
  }
};

