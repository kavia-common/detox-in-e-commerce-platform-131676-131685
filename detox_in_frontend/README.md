# DETOX-IN React Frontend

Brand-themed, responsive e-commerce frontend for DETOX-IN bottles and juice cans.

## Features
- Product browsing with search and category filter
- Product detail pages with quantity + add-to-cart
- Auth: register, login, logout
- Cart: view, update quantities, remove
- Checkout: shipping + payment (mock) and order creation
- Orders: history list and receipt view
- Mobile-first styling with DETOX-IN colors (primary #3EBC5C, secondary #282C34, accent #F7CA18)

## Getting Started

Install and run:
- npm install
- npm start

Build:
- npm run build

Tests (minimal):
- npm test

## Configuration

Environment variables:
- REACT_APP_API_BASE: Base URL for backend API (default '/api')

Example:
- echo "REACT_APP_API_BASE=/api" > .env.local

## Notes

- Authentication token is stored in localStorage under key 'dt_token'.
- API endpoints follow the provided backend: /auth/*, /products*, /cart*, /orders, /payments/intents.
- For protected routes (checkout, orders), users are redirected to login if unauthenticated.
