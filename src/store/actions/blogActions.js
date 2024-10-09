// blogActions.js
import axiosInstance from "../../AxiosInstance/axiosinstance";

export const fetchBlogs = () => async (dispatch) => {
  try {
    dispatch({ type: 'BLOGS_REQUEST' });
    const { data } = await axiosInstance.get('/get_blogs');
    dispatch({ type: 'BLOGS_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'BLOGS_FAIL', payload: error.message });
  }
};

export const addBlog = (blogData) => async (dispatch) => {
  try {
    dispatch({ type: 'BLOG_ADD_REQUEST' });
    const { data } = await axiosInstance.post('/add_blogs', blogData);
    dispatch({ type: 'BLOG_ADD_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'BLOG_ADD_FAIL', payload: error.message });
  }
};

export const updateBlog = (id, blogData) => async (dispatch) => {
  try {
    dispatch({ type: 'BLOG_UPDATE_REQUEST' });
    const { data } = await axiosInstance.post(`/update_blogs?id=${id}`, blogData);
    dispatch({ type: 'BLOG_UPDATE_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'BLOG_UPDATE_FAIL', payload: error.message });
  }
};
