import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

// PUBLIC_INTERFACE
export default function OrderReceipt() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no order passed in state, try to load from list and find by id
    const load = async () => {
      if (order) return;
      setLoading(true);
      try {
        const data = await api.listOrders();
        const list = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        const found = list.find(o => String(o.id) === String(id)) || list[list.length-1];
        setOrder(found || null);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="container" style={{paddingTop: 16}}>Loading...</div>;
  if (!order) return <div className="container" style={{paddingTop: 16}}>Order not found.</div>;

  return (
    <div className="container" style={{paddingTop: 16, maxWidth: 720}}>
      <div className="card" style={{padding: 16}}>
        <h2>Thank you for your purchase!</h2>
        <div className="helper">Order #{order.id}</div>
        <div className="line" />
        <div className="list">
          {(order.items || []).map((it, idx) => (
            <div key={idx} className="row">
              <div>{it.name || `Product ${it.productId}`}</div>
              <div>x{it.quantity}</div>
            </div>
          ))}
        </div>
        <div className="line" />
        <div className="row">
          <div style={{fontWeight:800}}>Total</div>
          <div style={{fontWeight:800}}>${Number(order.total || order.amount || 0).toFixed(2)}</div>
        </div>
        <div style={{marginTop: 12}}>
          <Link to="/orders" className="icon-btn">View all orders</Link>
        </div>
      </div>
    </div>
  );
}
