import React, { useState, useEffect } from 'react';
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
  const [isBlocked, setIsBlocked] = useState(false);
  const [timer, setTimer] = useState(0);

  const BLOCK_DURATION = 1 * 60 * 1000; // 30 minutes in milliseconds
  const ATTEMPT_LIMIT = 5;
  const ATTEMPT_STORAGE_KEY = 'unstructured_key_attempts';
  const BLOCK_STORAGE_KEY = 'unstructured_key_blocked';

  // Check block status on component load
  useEffect(() => {
    const checkBlockStatus = () => {
      const blockExpiry = localStorage.getItem(BLOCK_STORAGE_KEY);
      if (blockExpiry) {
        const expiryTime = new Date(blockExpiry).getTime();
        const currentTime = Date.now();
        if (currentTime < expiryTime) {
          setIsBlocked(true);
          setTimer(expiryTime - currentTime);
          return;
        } else {
          // Block expired, remove the key
          localStorage.removeItem(BLOCK_STORAGE_KEY);
          localStorage.removeItem(ATTEMPT_STORAGE_KEY);
        }
      }
      setIsBlocked(false);
    };

    checkBlockStatus();

    // Update timer if blocked
    const interval = setInterval(() => {
      if (isBlocked) {
        setTimer((prev) => {
          if (prev <= 1000) {
            clearInterval(interval);
            setIsBlocked(false);
            localStorage.removeItem(BLOCK_STORAGE_KEY);
            localStorage.removeItem(ATTEMPT_STORAGE_KEY);
            return 0;
          }
          return prev - 1000;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBlocked]);

  // Handle login submission
  const handleLogin = (e) => {
    e.preventDefault();

    if (isBlocked) return;

    dispatch(login(username, password))
      .then(() => {
        localStorage.removeItem(ATTEMPT_STORAGE_KEY);
        navigate('/dashboard');
      })
      .catch(() => {
        //console.log('here')
        const attempts = JSON.parse(localStorage.getItem(ATTEMPT_STORAGE_KEY)) || 0;
        const newAttempts = attempts + 1;
        localStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(newAttempts));

        if (newAttempts >= ATTEMPT_LIMIT) {
          const blockUntil = new Date(Date.now() + BLOCK_DURATION).toISOString();
          localStorage.setItem(BLOCK_STORAGE_KEY, blockUntil);
          setIsBlocked(true);
          setTimer(BLOCK_DURATION);
        }
      });
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: 'linear-gradient(to bottom right, #43cea2, #185a9d)',
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
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{
                backgroundColor: isBlocked ? '#6c757d' : '#009688',
                border: 'none',
                borderRadius: '5px',
              }}
              disabled={isBlocked || isLoading}
            >
              {isBlocked
                ? `Blocked (${formatTime(timer)})`
                : isLoading
                ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )
                : 'Login'}
            </button>
          </div>
        </form>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
