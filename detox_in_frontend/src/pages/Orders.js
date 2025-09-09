import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listOrders();
      setOrders(Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); },[]);

  return (
    <div className="container" style={{paddingTop: 16}}>
      <h2>Your Orders</h2>
      {loading ? <div>Loading...</div> : (
        <div className="list">
          {orders.length === 0 && <div className="empty">No orders yet.</div>}
          {orders.map(o => (
            <Link key={o.id} to={`/orders/${o.id}`} className="card" style={{padding: 16, textDecoration:'none', color: 'inherit'}}>
              <div className="row">
                <div>
                  <div style={{fontWeight: 800}}>Order #{o.id}</div>
                  <div className="helper">{new Date(o.createdAt || o.created_at || Date.now()).toLocaleString()}</div>
                </div>
                <div style={{fontWeight: 800}}>${Number(o.total || o.amount || 0).toFixed(2)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
