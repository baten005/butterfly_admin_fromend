// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch from Redux
import './App.css';
import AllRoutes from './AllRoutes';
import Login from './Authentication/login';
import { restoreSession } from './store/actions/authActions'; // Import restoreSession action
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const ProtectedRoute = ({ element }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? React.cloneElement(element, { user }) : <Navigate to="/" />;
};

const RedirectIfAuthenticated = ({ element }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/dashboard" /> : element;
};

const DashboardRedirect = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/dashboard') && location.pathname !== '/dashboard') {
      window.location.href = '/dashboard';
    }
  }, [location]);

  return children;
};

function App() {
  const dispatch = useDispatch();

  // Restore session on initial load
  useEffect(() => {
    Modal.setAppElement('#root');
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <div className="App">
      <ToastContainer/>
      <Router>
        <ScrollToTop />
        
        <Routes>
          <Route path="/" element={<RedirectIfAuthenticated element={<Login />} />} />
          <Route
            path="/*"
            element={
              <DashboardRedirect>
                <ProtectedRoute element={<AllRoutes />} />
              </DashboardRedirect>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
