// src/Components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/actions/authActions';
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../Styles/login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(username, password)).then(() => {
      navigate('/dashboard');
    });
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-form card p-4">
        <img src={`${process.env.PUBLIC_URL}/logo192.png`} alt="Huraira Consultancy" />
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <br />
          {!isLoading ? (
            <button type="submit" className="btn btn-primary w-100">Login</button>
          ) : (
            <button type="button" className="btn btn-primary w-100" disabled>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Loading...
            </button>
          )}
        </form>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
