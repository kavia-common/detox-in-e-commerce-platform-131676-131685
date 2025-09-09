import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import QuantityInput from './QuantityInput';
import { useCart } from '../context/CartContext';

// PUBLIC_INTERFACE
export default function ProductCard({ product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const price = Number(product?.price || 0).toFixed(2);

  const addToCart = async () => {
    await add(product.id, qty);
  };

  const imgAlt = product?.name || 'Product image';

  return (
    <div className="card">
      <Link to={`/product/${product.id}`} className="card-media" aria-label={`Open ${product?.name}`}>
        <span className="badge">{product?.category || 'Drink'}</span>
        {/* Simplified placeholder media since we don't have images */}
        <div style={{position:'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#27a048', fontSize: 42}}>
          🧃
        </div>
        <img alt={imgAlt} style={{display: 'none'}} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product.id}`} className="card-title">{product?.name}</Link>
        <div className="card-desc">{product?.description || 'Fresh and revitalizing.'}</div>
        <div className="price">
          <div className="price-main">${price}</div>
          {product?.volume && <div className="price-sub">• {product.volume}</div>}
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center', justifyContent:'space-between'}}>
          <QuantityInput value={qty} onChange={setQty} />
          <button className="primary" onClick={addToCart} aria-label="Add to cart">Add</button>
        </div>
      </div>
    </div>
  );
}
