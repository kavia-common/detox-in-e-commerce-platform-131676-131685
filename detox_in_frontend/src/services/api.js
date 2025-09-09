/**
 * API service for DETOX-IN frontend. Handles base URL, headers, token attach, and error handling.
 */
const API_BASE = process.env.REACT_APP_API_BASE || '/api';

function getToken() {
  try {
    return localStorage.getItem('dt_token');
  } catch {
    return null;
  }
}

async function request(path, { method = 'GET', headers = {}, body } = {}) {
  const init = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };
  const token = getToken();
  if (token) init.headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) init.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, init);
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  if (!res.ok) {
    const message = data?.message || data || res.statusText;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export const api = {
  /** Auth */
  // PUBLIC_INTERFACE
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  // PUBLIC_INTERFACE
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  // PUBLIC_INTERFACE
  logout: () => request('/auth/logout', { method: 'POST' }),

  /** Products */
  // PUBLIC_INTERFACE
  listProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/products${q ? `?${q}` : ''}`);
  },
  // PUBLIC_INTERFACE
  getProduct: (id) => request(`/products/${id}`),
  // PUBLIC_INTERFACE
  listCategories: () => request('/products/categories'),

  /** Cart (requires auth) */
  // PUBLIC_INTERFACE
  getCart: () => request('/cart'),
  // PUBLIC_INTERFACE
  addToCart: ({ productId, quantity }) =>
    request('/cart', { method: 'POST', body: { productId, quantity } }),
  // PUBLIC_INTERFACE
  updateCartItem: ({ productId, quantity }) =>
    request(`/cart/${productId}`, { method: 'PATCH', body: { quantity } }),
  // PUBLIC_INTERFACE
  removeCartItem: (productId) =>
    request(`/cart/${productId}`, { method: 'DELETE' }),

  /** Orders */
  // PUBLIC_INTERFACE
  createOrder: (payload) => request('/orders', { method: 'POST', body: payload }),
  // PUBLIC_INTERFACE
  listOrders: () => request('/orders'),

  /** Payments (mock) */
  // PUBLIC_INTERFACE
  createPaymentIntent: (payload) => request('/payments/intents', { method: 'POST', body: payload }),
};
