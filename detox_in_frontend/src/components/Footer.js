import React from 'react';

// PUBLIC_INTERFACE
export default function Footer() {
  /** A simple brand-themed footer for DETOX-IN. */
  return (
    <footer className="footer">
      <div className="container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12}}>
        <div style={{fontWeight: 700, color: 'var(--color-secondary)'}}>DETOX-IN</div>
        <div style={{color: 'var(--color-muted)'}}>© {new Date().getFullYear()} Detox-In Co. All rights reserved.</div>
      </div>
    </footer>
  );
}
