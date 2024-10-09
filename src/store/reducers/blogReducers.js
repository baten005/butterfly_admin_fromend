// blogReducers.js
export const blogListReducer = (state = { blogs: [] }, action) => {
    switch (action.type) {
      case 'BLOGS_REQUEST':
        return { loading: true, blogs: [] };
      case 'BLOGS_SUCCESS':
        return { loading: false, blogs: action.payload };
      case 'BLOGS_FAIL':
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const blogAddUpdateReducer = (state = { loading: false, success: false, error: null }, action) => {
    switch (action.type) {
      case 'BLOG_ADD_REQUEST':
      case 'BLOG_UPDATE_REQUEST':
        return { loading: true };
      case 'BLOG_ADD_SUCCESS':
        return { loading: false, success: true };
      case 'BLOG_UPDATE_SUCCESS':
        return { loading: false, success: true };
      case 'BLOG_ADD_FAIL':
      case 'BLOG_UPDATE_FAIL':
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  