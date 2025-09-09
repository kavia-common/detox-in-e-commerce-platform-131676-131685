import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

// PUBLIC_INTERFACE
export default function Checkout() {
  const nav = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, total, reload } = useCart();
  const [address, setAddress] = useState({ fullName: '', line1: '', city: '', zip: '' });
  const [payment, setPayment] = useState({ method: 'card', nameOnCard: '' });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="container" style={{paddingTop: 24}}>
        Please <Link to="/login" state={{ from: '/checkout' }}>login</Link> to checkout.
      </div>
    );
  }

  const valid = () => {
    return address.fullName && address.line1 && address.city && address.zip && payment.method;
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    if (!valid()) {
      setError('Please complete shipping and payment info.');
      return;
    }
    if (!items || items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setPlacing(true);
    try {
      // 1) Create payment intent (mock)
      await api.createPaymentIntent({ amount: Math.round(total * 100), currency: 'usd', method: payment.method });

      // 2) Create order
      const order = await api.createOrder({
        items: items.map(i => ({ productId: i.productId || i.id, quantity: i.quantity })),
        shippingAddress: address,
        payment: { method: payment.method, status: 'paid' }
      });

      // 3) Refresh cart and go to receipt
      await reload();
      nav(`/orders/${order.id || 'latest'}`, { state: { order } });
    } catch (e2) {
      setError(e2.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container" style={{paddingTop: 16}}>
      <h2>Checkout</h2>
      <div className="page">
        <form className="form" onSubmit={placeOrder}>
          <div className="card" style={{padding: 16}}>
            <h3>Shipping</h3>
            <div className="input">
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" value={address.fullName} onChange={(e)=>setAddress(a=>({...a, fullName: e.target.value}))} required />
            </div>
            <div className="input">
              <label htmlFor="line1">Address</label>
              <input id="line1" value={address.line1} onChange={(e)=>setAddress(a=>({...a, line1: e.target.value}))} required />
            </div>
            <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
              <div className="input">
                <label htmlFor="city">City</label>
                <input id="city" value={address.city} onChange={(e)=>setAddress(a=>({...a, city: e.target.value}))} required />
              </div>
              <div className="input">
                <label htmlFor="zip">ZIP</label>
                <input id="zip" value={address.zip} onChange={(e)=>setAddress(a=>({...a, zip: e.target.value}))} required />
              </div>
            </div>
          </div>

          <div className="card" style={{padding: 16}}>
            <h3>Payment</h3>
            <div className="input">
              <label htmlFor="method">Method</label>
              <select id="method" value={payment.method} onChange={(e)=>setPayment(p=>({...p, method: e.target.value}))}>
                <option value="card">Card</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
            <div className="input">
              <label htmlFor="nameOnCard">Name on Card</label>
              <input id="nameOnCard" value={payment.nameOnCard} onChange={(e)=>setPayment(p=>({...p, nameOnCard: e.target.value}))} required />
            </div>
          </div>

          {error && <div className="error" role="alert">{error}</div>}
          <button className="primary" type="submit" disabled={placing} style={{padding: '12px 16px', borderRadius: 12, fontWeight: 800}}>
            {placing ? 'Placing order...' : `Pay $${total.toFixed(2)} and Place Order`}
          </button>
        </form>

        <aside className="drawer">
          <h3>Summary</h3>
          <div className="row">
            <div>Items</div>
            <div>{items?.length || 0}</div>
          </div>
          <div className="row">
            <div>Subtotal</div>
            <div>${total.toFixed(2)}</div>
          </div>
          <div className="row">
            <div>Shipping</div>
            <div>$0.00</div>
          </div>
          <div className="line" />
          <div className="row">
            <div style={{fontWeight: 800}}>Total</div>
            <div style={{fontWeight: 800}}>${total.toFixed(2)}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
