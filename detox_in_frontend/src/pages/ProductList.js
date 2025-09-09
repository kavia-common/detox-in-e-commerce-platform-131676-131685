import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

// PUBLIC_INTERFACE
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [list, cats] = await Promise.all([
        api.listProducts({ q, category: cat }),
        api.listCategories()
      ]);
      setProducts(Array.isArray(list?.items) ? list.items : Array.isArray(list) ? list : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const submitSearch = async (e) => {
    e.preventDefault();
    await load();
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <form className="searchbar" onSubmit={submitSearch}>
            <input
              placeholder="Search juices, bottles..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search products"
            />
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filter by category">
              <option value="">All categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="primary" type="submit">Search</button>
          </form>
        </div>
      </section>

      <div className="container" style={{paddingTop: 16}}>
        {loading ? <div>Loading products...</div> : (
          <div className="grid">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
}
