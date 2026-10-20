import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;

  return (
    <div className="toast-floating">
      <CheckCircle2 size={18} color="var(--accent-gold)" />
      <span>{toastMessage}</span>
    </div>
  );
}
