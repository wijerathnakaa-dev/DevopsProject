import React, { useState } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, Thermometer, Clock, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const maxStock = product.stock_quantity ?? 99;
  const isOutOfStock = maxStock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const formattedPrice = Number(product.price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-product-grid">
          <div>
            <img
              src={product.image_url || '/images/ceylon-black-tea.jpg'}
              alt={product.name}
              className="modal-product-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/ceylon-black-tea.jpg';
              }}
            />
            {product.weight && (
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                Packaging: <strong>{product.weight}</strong>
              </div>
            )}
          </div>

          <div className="modal-info-col">
            <span className="product-category-name" style={{ marginBottom: '8px' }}>
              {product.category_name || 'Ceylon Tea'}
            </span>

            <h2 className="modal-title">{product.name}</h2>

            <div className="modal-price-tag">
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginRight: '6px' }}>
                {product.currency || 'LKR'}
              </span>
              {formattedPrice}
            </div>

            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
              {product.description}
            </p>

            {/* Brewing Notes / Botanical Details */}
            <div style={{
              background: '#f8f5ee',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '13px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Thermometer size={16} color="var(--accent-gold)" />
                <span>Steep Temp: <strong>90°C – 95°C</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--accent-gold)" />
                <span>Brew Time: <strong>3–4 Mins</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--accent-gold)" />
                <span>Origin: <strong>Sri Lanka (Ceylon)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--accent-gold)" />
                <span>Grade: <strong>Single Origin Premium</strong></span>
              </div>
            </div>

            {/* Stock status */}
            <div style={{ marginBottom: '20px', fontSize: '14px' }}>
              Status:{' '}
              {isOutOfStock ? (
                <strong style={{ color: '#dc2626' }}>Currently Out of Stock</strong>
              ) : (
                <strong style={{ color: '#059669' }}>In Stock ({maxStock} available)</strong>
              )}
            </div>

            {/* Quantity Stepper & Add Button */}
            {!isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
                <div className="quantity-stepper">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >
                    –
                  </button>
                  <span>{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(maxStock, q + 1))}
                    disabled={qty >= maxStock}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleAdd}
                  disabled={added}
                >
                  {added ? (
                    <>
                      <Check size={18} /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add to Cart • LKR {(Number(product.price) * qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
