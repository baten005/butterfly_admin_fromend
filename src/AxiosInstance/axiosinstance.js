import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3004/',
  //baseURL: 'https://backend.butterfly.hurairaconsultancy.com/',
  withCredentials: true, 
});
//https://backend.butterfly.matrimony.admin.hurairaconsultancy.com/testimonials
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('Butterfly_matrimony_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;