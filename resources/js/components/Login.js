import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/login', { username, password });
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid credentials.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-card-header"><div className="logo-circle">SFMS</div><h2>SFMS Management System</h2><p className="subtitle">Student & Faculty Management</p></div>
        <div className="login-card-body">
          <form onSubmit={handleSubmit}>
            <label className="input-label">Username</label>
            <input type="text" className="input" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
            <label className="input-label">Password</label>
            <input type="password" className="input" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="alert-error">{error}</div>}
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
