import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !password) {
      setErr('Please enter email and password');
      return;
    }
    const res = await login(email, password);
    if (res.ok) {
      const redirectTo = location.state?.from || '/';
      nav(redirectTo, { replace: true });
    } else {
      setErr(res.error || 'Login failed');
    }
  };

  return (
    <div className="container" style={{paddingTop: 24, maxWidth: 480}}>
      <h2>Welcome back</h2>
      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="input">
          <label htmlFor="email">Email</label>
          <input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
        </div>
        <div className="input">
          <label htmlFor="password">Password</label>
          <input id="password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="••••••••" required />
        </div>
        {err && <div className="error" role="alert">{err}</div>}
        <button type="submit" className="primary" disabled={loading} style={{padding: '12px 16px', borderRadius: 12, fontWeight: 800}}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <div className="helper" style={{marginTop: 12}}>
        New to DETOX-IN? <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
}
