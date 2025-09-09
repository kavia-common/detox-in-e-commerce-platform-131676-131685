import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Register() {
  const nav = useNavigate();
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setOk(false);
    if (!name || !email || !password) {
      setErr('Please complete all fields');
      return;
    }
    if (password.length < 6) {
      setErr('Password must be at least 6 characters');
      return;
    }
    const res = await register(name, email, password);
    if (res.ok) {
      setOk(true);
      setTimeout(()=>nav('/'), 600);
    } else {
      setErr(res.error || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{paddingTop: 24, maxWidth: 480}}>
      <h2>Create your account</h2>
      <form className="form" onSubmit={onSubmit} noValidate>
        <div className="input">
          <label htmlFor="name">Name</label>
          <input id="name" value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="Jane Doe" required />
        </div>
        <div className="input">
          <label htmlFor="email">Email</label>
          <input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
        </div>
        <div className="input">
          <label htmlFor="password">Password</label>
          <input id="password" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="••••••••" required />
        </div>
        {err && <div className="error" role="alert">{err}</div>}
        {ok && <div className="success">Account created!</div>}
        <button type="submit" className="primary" disabled={loading} style={{padding: '12px 16px', borderRadius: 12, fontWeight: 800}}>
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </form>
      <div className="helper" style={{marginTop: 12}}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}
