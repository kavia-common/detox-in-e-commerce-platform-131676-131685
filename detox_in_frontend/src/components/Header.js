import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function CartIcon({ count }) {
  return (
    <span className="icon-btn" aria-label={`Cart with ${count} items`}>
      🛒 <b>{count}</b>
    </span>
  );
}

// PUBLIC_INTERFACE
export default function Header() {
  const { items } = useCart();
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="DETOX-IN Home">
          <span className="brand-badge">DI</span>
          <span className="brand-title">DETOX-IN</span>
        </Link>
        <nav className="nav" aria-label="Primary Navigation">
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : undefined}>Shop</NavLink>
          <NavLink to="/orders" className={({isActive}) => isActive ? 'active' : undefined}>Orders</NavLink>
          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={({isActive}) => isActive ? 'active' : undefined}>Login</NavLink>
              <NavLink to="/register" className={({isActive}) => isActive ? 'active' : undefined}>Sign up</NavLink>
            </>
          )}
          {isAuthenticated && (
            <>
              <span className="icon-btn" title={user?.name || user?.email || 'Account'}>👤 {user?.name || 'Account'}</span>
              <button onClick={logout} className="icon-btn" aria-label="Logout">↩ Logout</button>
            </>
          )}
          <NavLink to="/cart" aria-label="Cart">
            <CartIcon count={items?.length || 0} />
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
