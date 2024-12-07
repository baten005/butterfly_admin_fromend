import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/actions/authActions';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: 'linear-gradient(to bottom right, #43cea2, #185a9d)'
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '10px',
          backgroundColor: '#fff',
        }}
      >
        <div className="text-center mb-4">
          <img
            src={`${process.env.PUBLIC_URL}/assets/butterfly_matrimony.png`}
            alt="Huraira Consultancy"
            style={{ maxWidth: '150px' }}
          />
        </div>
        <h3 className="text-center mb-4" style={{ color: '#43cea2' }}>
          Welcome Back!
        </h3>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={{
                borderRadius: '5px',
                border: '1px solid #ced4da',
                padding: '10px 15px',
              }}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                borderRadius: '5px',
                border: '1px solid #ced4da',
                padding: '10px 15px',
              }}
              required
            />
          </div>
          <div className="d-grid mb-3">
            {!isLoading ? (
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{
                  backgroundColor: '#009688',
                  border: 'none',
                  borderRadius: '5px',
                }}
              >
                Login
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{
                  backgroundColor: '#6a11cb',
                  border: 'none',
                  borderRadius: '5px',
                }}
                disabled
              >
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </button>
            )}
          </div>
        </form>
        {error && (
          <p className="text-danger mt-3 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
