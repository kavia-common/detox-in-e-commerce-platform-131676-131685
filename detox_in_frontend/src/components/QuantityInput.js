import React from 'react';

// PUBLIC_INTERFACE
export default function QuantityInput({ value, onChange, min = 1, max = 99 }) {
  const dec = () => onChange(Math.max(min, (Number(value) || 0) - 1));
  const inc = () => onChange(Math.min(max, (Number(value) || 0) + 1));
  return (
    <div className="qty-control" role="group" aria-label="Quantity selector">
      <button type="button" onClick={dec} aria-label="Decrease">-</button>
      <input
        aria-label="Quantity"
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
        inputMode="numeric"
        pattern="[0-9]*"
      />
      <button type="button" onClick={inc} aria-label="Increase">+</button>
    </div>
  );
}
