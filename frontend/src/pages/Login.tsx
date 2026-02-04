import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import logo from './logo.png'; // logo imported here

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="logo" />
        </div>

        <p className="login-subtitle">Sign in to continue</p>

        {error && <div className="error-box">❌ {error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter username"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div className="test-accounts">
          <p>📝 Test Accounts:</p>
          <p>👤 Admin: <code>admin</code> / <code>admin123</code></p>
          <p>👷 Worker: <code>worker</code> / <code>worker123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
