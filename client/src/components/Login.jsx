import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  const navigate = useNavigate();

  // Primary Login Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login operational failure.');
      }
      
      // Save secure JWT token payload string 
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update global context status and route inside the system
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  // Automated Forgot Password Trigger Routine
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setMessage(data.message);
      setIsForgotMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>EdBook Management</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          {isForgotMode ? 'Account Password Recovery Node' : 'Sign in to access your dashboard'}
        </p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}
        {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', fontWeight: 'bold' }}>{message}</div>}

        {!isForgotMode ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Institutional Email</label>
              <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn">Authenticate Secure Login</button>
            
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsForgotMode(true)}>
                Forgot Password?
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label>Target Account Email</label>
              <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Configure New Password Target</label>
              <input type="password" className="form-control" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Type replacement password" />
            </div>
            <button type="submit" className="btn">Execute Password Override</button>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setIsForgotMode(false)}>
                Back to Standard Login
              </button>
            </p>
          </form>
        )}

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          New to EdBook? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Create standard profile</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
