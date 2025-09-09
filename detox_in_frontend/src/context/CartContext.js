import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

// PUBLIC_INTERFACE
export const CartContext = createContext(null);

// PUBLIC_INTERFACE
export function useCart() {
  return useContext(CartContext);
}

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadCart = async () => {
    if (!isAuthenticated) { setItems([]); return; }
    setRefreshing(true);
    try {
      const data = await api.getCart();
      // Expecting shape like: { items: [{ productId, name, price, quantity, imageUrl }], total }
      if (Array.isArray(data?.items)) {
        setItems(data.items);
      } else if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // PUBLIC_INTERFACE
  const add = async (productId, quantity = 1) => {
    await api.addToCart({ productId, quantity });
    await loadCart();
  };
  // PUBLIC_INTERFACE
  const update = async (productId, quantity) => {
    await api.updateCartItem({ productId, quantity });
    await loadCart();
  };
  // PUBLIC_INTERFACE
  const remove = async (productId) => {
    await api.removeCartItem(productId);
    await loadCart();
  };

  const total = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);
  }, [items]);

  const value = useMemo(() => ({
    items, total, refreshing, add, update, remove, reload: loadCart
  }), [items, total, refreshing]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
