import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration anomaly.');

      setMessage(data.message);
      
      // Delay redirection slightly so they can read the custom approval response text message
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register Profile</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Create your credential records below</p>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}
        {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', fontWeight: 'bold', padding: '10px', background: '#f0fdf4', borderRadius: '4px' }}>{message}</div>}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Secure Password</label>
            <input type="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>System Role Assignment</label>
            <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Employee / Student (Immediate Access)</option>
              <option value="manager">Manager (Requires Security Verification Approval)</option>
            </select>
          </div>
          <button type="submit" className="btn">Publish User Credentials</button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
