import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import QuantityInput from '../components/QuantityInput';
import { useCart } from '../context/CartContext';

// PUBLIC_INTERFACE
export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getProduct(id);
      setProduct(data);
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  if (loading) return <div className="container" style={{paddingTop: 16}}>Loading...</div>;
  if (!product) return <div className="container" style={{paddingTop: 16}}>Product not found.</div>;

  const price = Number(product?.price || 0).toFixed(2);

  return (
    <div className="container" style={{paddingTop: 16}}>
      <div className="page">
        <div>
          <div className="card">
            <div className="card-media">
              <span className="badge">{product?.category || 'Drink'}</span>
              <div style={{position:'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#27a048', fontSize: 64}}>🧃</div>
            </div>
            <div className="card-body">
              <h2 className="card-title" style={{fontSize:'1.4rem'}}>{product?.name}</h2>
              <div className="card-desc">{product?.description || 'Refreshing detox beverage.'}</div>
              <div className="price" style={{marginTop: 8}}>
                <div className="price-main">${price}</div>
                {product?.volume && <div className="price-sub">• {product.volume}</div>}
              </div>
              <div style={{display:'flex', gap:12, alignItems:'center', marginTop: 12}}>
                <QuantityInput value={qty} onChange={setQty} />
                <button className="primary" onClick={async () => { await add(product.id, qty); }}>Add to cart</button>
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* Space reserved for recommendations, nutrition, etc. */}
        </div>
      </div>
    </div>
  );
}
