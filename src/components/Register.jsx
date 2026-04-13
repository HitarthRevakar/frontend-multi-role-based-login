import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    }
  };

  return (
    <div className="glass-panel">
      <h1 className="title">Create Account</h1>
      <p className="subtitle">Sign up for a new portal account</p>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <label className="input-label">Full Name</label>
          <input
            type="text"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="newuser@system.com"
            required
          />
        </div>
        
        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
        
        <button type="submit" className="btn" style={{ marginBottom: '15px' }}>Register</button>
        
        <p style={{ textAlign: 'center', fontSize: '14px', margin: 0 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>Sign In here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
