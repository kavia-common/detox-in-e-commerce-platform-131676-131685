import React from 'react';
import { useCart } from '../context/CartContext';
import QuantityInput from './QuantityInput';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function CartDrawer({ showCheckoutButton = true }) {
  const { items, total, update, remove } = useCart();

  return (
    <aside className="drawer" aria-label="Cart summary">
      <h3 style={{marginTop: 0}}>Your Cart</h3>
      {(!items || items.length === 0) ? (
        <div className="empty">Your cart is empty.</div>
      ) : (
        <div className="list">
          {items.map((it) => (
            <div key={it.productId || it.id} className="row">
              <div>
                <div style={{fontWeight: 700, color: 'var(--color-secondary)'}}>{it.name}</div>
                <div className="helper">${Number(it.price).toFixed(2)}</div>
              </div>
              <div style={{display:'flex', alignItems:'center', gap: 8}}>
                <QuantityInput value={it.quantity} onChange={(q) => update(it.productId || it.id, q)} />
                <button className="icon-btn" onClick={() => remove(it.productId || it.id)} aria-label={`Remove ${it.name}`}>✕</button>
              </div>
            </div>
          ))}
          <div className="line" />
          <div className="row">
            <div style={{fontWeight: 800, color: 'var(--color-secondary)'}}>Subtotal</div>
            <div style={{fontWeight: 800}}>${total.toFixed(2)}</div>
          </div>
          {showCheckoutButton && (
            <Link to="/checkout" className="primary" style={{textAlign:'center', padding: '12px 16px', borderRadius: 12, textDecoration: 'none', fontWeight: 800}}>
              Proceed to Checkout →
            </Link>
          )}
        </div>
      )}
    </aside>
  );
}
