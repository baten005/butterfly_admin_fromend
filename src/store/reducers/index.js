import { combineReducers } from 'redux';
import sidebarReducer from './sidebarReducer'; 
import dashboardReducer from "./dashboardReducer";
import userReducer from './userReducer';
import matchingReducer from './matchingReducer';
import HomePageImageReducer from './homePageImageReducer';
import authReducer from './authReducers';
import adminReducer from './adminReducer';
import socialReducer from './socialReducer';
import socialLinkUpdateReducers from './socialLinkUpdateReducers';
import testimonialReducers from './testimonialReducers';
import testimonial from '../../Settings/testimonial';
import successList from '../../Settings/successList';
import successListReducer from './successListReducers';
import { blogListReducer, blogAddUpdateReducer } from './blogReducers';

const rootReducer = combineReducers({
  sidebar: sidebarReducer,
  dashboard: dashboardReducer,
  user: userReducer,
  matching:matchingReducer,
  homePageImage:HomePageImageReducer,
  auth: authReducer,
  admin: adminReducer,
  social: socialReducer,
  contact:socialLinkUpdateReducers, 
  testimonials:testimonialReducers,
  successList:successListReducer,
  blogList: blogListReducer,
  blogAddUpdate: blogAddUpdateReducer,
  
});

export default rootReducer;
