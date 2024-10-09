
import axiosInstance from '../../AxiosInstance/axiosinstance';

export const FETCH_ADMINS_SUCCESS = 'FETCH_ADMINS_SUCCESS';
export const CREATE_ADMIN_SUCCESS = 'CREATE_ADMIN_SUCCESS';
export const UPDATE_ADMIN_PERMISSIONS_SUCCESS = 'UPDATE_ADMIN_PERMISSIONS_SUCCESS';
export const DELETE_ADMIN_SUCCESS = 'DELETE_ADMIN_SUCCESS';
export const SET_SELECTED_ADMIN = 'SET_SELECTED_ADMIN';
export const SET_SELECTED_PERMISSIONS = 'SET_SELECTED_PERMISSIONS';
export const SET_LOADING = 'SET_LOADING';
export const SET_MESSAGE = 'SET_MESSAGE';

export const fetchAdmins = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get('/getAdmins');
    dispatch({ type: FETCH_ADMINS_SUCCESS, payload: response.data });
  } catch (error) {
    console.error('Error fetching admins:', error);
  }
};

export const createAdmin = (username, password) => async (dispatch) => {
  try {
    await axiosInstance.post('/addAdmin', { admin: username, password });
    dispatch({ type: CREATE_ADMIN_SUCCESS });
    dispatch(fetchAdmins());
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

export const updateAdminPermissions = (permissions, adminId) => async (dispatch) => {
  try {
    await axiosInstance.post('/updateAdminPermission', { selectedPermissions: permissions, admin: adminId });
    dispatch({ type: UPDATE_ADMIN_PERMISSIONS_SUCCESS });
    dispatch(fetchAdmins());
  } catch (error) {
    console.error('Error updating admin permissions:', error);
  }
};

export const deleteAdmin = (adminId) => async (dispatch) => {
  try {
    await axiosInstance.post('/deleteAdmin', { admin: adminId });
    dispatch({ type: DELETE_ADMIN_SUCCESS });
    dispatch(fetchAdmins());
  } catch (error) {
    console.error('Error deleting admin:', error);
  }
};

export const setSelectedAdmin = (admin) => ({
  type: SET_SELECTED_ADMIN,
  payload: admin,
});

export const setSelectedPermissions = (permissions) => ({
  type: SET_SELECTED_PERMISSIONS,
  payload: permissions,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message,
});
