import React, { useState } from 'react';
import { useAuth } from '../../src/authState';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      // Error will be shown from authState
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <span onClick={() => navigate('/register')}>Register</span></p>
      </div>
    </>
  );
};

export default Login;