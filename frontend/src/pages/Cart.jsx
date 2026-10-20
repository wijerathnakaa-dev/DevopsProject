import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalCount } = useCart();
  const navigate = useNavigate();

  const shippingFee = subtotal >= 5000 || items.length === 0 ? 0 : 350.00;
  const grandTotal = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--primary-subtle)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '12px' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto 30px', fontSize: '16px' }}>
            Explore our single-origin Ceylon orthodox teas, herbal blends, and organic Moringa extracts to begin your tea journey.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explore Tea Catalogue <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '34px', color: 'var(--primary)', marginBottom: '8px' }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Review your selected Ceylon harvest teas ({totalCount} {totalCount === 1 ? 'item' : 'items'})
          </p>
        </div>

        <div className="cart-grid-layout">
          {/* Items Table Panel */}
          <div className="cart-items-panel">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-color)',
              marginBottom: '8px'
            }}>
              <span style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Product Details
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={clearCart}
                style={{ color: '#dc2626', fontSize: '13px' }}
              >
                Clear Cart
              </button>
            </div>

            {items.map((item) => {
              const lineTotal = item.price * item.quantity;
              return (
                <div key={item.id} className="cart-table-row">
                  <img
                    src={item.image_url || '/images/ceylon-black-tea.jpg'}
                    alt={item.name}
                    className="cart-thumb"
                    onError={(e) => { e.target.src = '/images/ceylon-black-tea.jpg'; }}
                  />

                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
                      {item.category_name || 'Ceylon Tea'}
                    </span>
                    <h4 style={{ fontSize: '16px', color: 'var(--primary)', margin: '2px 0 4px', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                      LKR {Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })} each
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="quantity-stepper">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      title="Decrease quantity"
                    >
                      –
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)', fontSize: '16px' }}>
                    LKR {lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>

                  {/* Remove Button */}
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: '#991b1b', padding: '8px' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}

            <div style={{ paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/products" className="btn btn-outline btn-sm">
                ← Continue Shopping
              </Link>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--accent-gold)" /> Guaranteed Freshness & Purity
              </div>
            </div>
          </div>

          {/* Order Summary Panel */}
          <div className="cart-summary-card">
            <h3 className="cart-summary-title">Order Summary</h3>

            <div className="summary-line">
              <span style={{ color: 'var(--text-muted)' }}>Subtotal ({totalCount} items)</span>
              <strong>LKR {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>

            <div className="summary-line">
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={14} /> Islandwide Delivery
              </span>
              <span>
                {shippingFee === 0 ? (
                  <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span>
                ) : (
                  `LKR ${shippingFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                )}
              </span>
            </div>

            {subtotal < 5000 && (
              <div style={{
                background: 'var(--accent-gold-light)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '12.5px',
                color: 'var(--accent-gold-dark)',
                marginBottom: '16px'
              }}>
                Add <strong>LKR {(5000 - subtotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> more to enjoy <strong>Free Islandwide Delivery</strong>!
              </div>
            )}

            <div className="summary-line total">
              <span>Estimated Total</span>
              <span>LKR {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '14px 0 24px', lineHeight: 1.5 }}>
              * Final order total will be calculated and validated securely by the Express server upon checkout submission.
            </p>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
