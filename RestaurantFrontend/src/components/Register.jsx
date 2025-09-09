import React, { useState } from 'react';
import { useAuth } from '../../src/authState';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      await register(name, email, password);
    } catch (err) {
      // Error will be shown from authState
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
      </div>
    </>
  );
};

export default Register;