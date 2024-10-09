// AlltheImportedRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard/dashboard';
import User from './Dashboard/user';
import Matching from './Dashboard/matching';
import HomePageImage from './Settings/homePageImage';
import SocialLinkUpdate from './Settings/socialLinkUpdate';
import Testimonial from './Settings/testimonial';
import Sms from './Marketing/sms';
import Report from './Environment/report';
import Admin from './Environment/admin';
import SuccessList from './Settings/successList';
import Blog from './Marketing/blog';
import ChatRequests from './Dashboard/chatRequests';

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="user" element={<User />} />
      <Route path="matching" element={<Matching />} />
      <Route path="home-page-image" element={<HomePageImage />} />
      <Route path="social-link-update" element={<SocialLinkUpdate />} />
      <Route path="testimonial" element={<Testimonial />} />
      <Route path="sms" element={<Sms />} />
      <Route path="blog" element={<Blog />} />
      <Route path="report" element={<Report />} />
      <Route path="admin" element={<Admin />} />
      <Route path="success-list" element={<SuccessList />} />
      <Route path="chat-requests" element={<ChatRequests />} />
    </Routes>
  );
};

export default AllRoutes;

