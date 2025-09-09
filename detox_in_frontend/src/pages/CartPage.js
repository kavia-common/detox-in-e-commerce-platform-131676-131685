import React from 'react';
import { useCart } from '../context/CartContext';
import QuantityInput from '../components/QuantityInput';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function CartPage() {
  const { items, total, update, remove } = useCart();

  return (
    <div className="container" style={{paddingTop: 16}}>
      <div className="page">
        <div>
          <h2>Your Cart</h2>
          {(!items || items.length === 0) ? (
            <div className="empty">
              Your cart is empty. <Link to="/">Browse products</Link>
            </div>
          ) : (
            <div className="list">
              {items.map((it) => (
                <div key={it.productId || it.id} className="card" style={{padding: 12}}>
                  <div className="row">
                    <div>
                      <div style={{fontWeight: 800}}>{it.name}</div>
                      <div className="helper">${Number(it.price).toFixed(2)}</div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap: 8}}>
                      <QuantityInput value={it.quantity} onChange={(q) => update(it.productId || it.id, q)} />
                      <button className="icon-btn" onClick={() => remove(it.productId || it.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="row" style={{padding: '8px 4px'}}>
                <div style={{fontWeight: 800}}>Subtotal</div>
                <div style={{fontWeight: 800}}>${total.toFixed(2)}</div>
              </div>
              <Link to="/checkout" className="primary" style={{textAlign:'center', padding: '12px 16px', borderRadius: 12, textDecoration: 'none', fontWeight: 800}}>
                Proceed to Checkout →
              </Link>
            </div>
          )}
        </div>
        <div>
          {/* Side summary could be here if needed */}
        </div>
      </div>
    </div>
  );
}
