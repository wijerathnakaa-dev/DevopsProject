import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import {
  CheckCircle,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Form state matching Section 7.5
  const [recipientName, setRecipientName] = useState(user?.name || 'Kavindu Wijerathna');
  const [phone, setPhone] = useState('0771234567');
  const [addressLine1, setAddressLine1] = useState('14/2 Hill Crest Road');
  const [city, setCity] = useState('Galle');
  const [district, setDistrict] = useState('Galle');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  const shippingFee = subtotal >= 5000 || items.length === 0 ? 0 : 350.00;
  const estimatedTotal = subtotal + shippingFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      navigate('/products');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    // Build payload according to Section 7.5
    const payload = {
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      delivery_address: {
        recipient_name: recipientName.trim(),
        phone: phone.trim(),
        address_line1: addressLine1.trim(),
        city: city.trim(),
        district: district.trim(),
      },
      payment_method: paymentMethod,
    };

    try {
      const res = await createOrder(payload);
      const created = res.data || res;
      setCompletedOrder(created);
      clearCart();
    } catch (err) {
      console.error('Failed to submit order', err);
      setErrorMessage(err.message || 'Failed to place order. Please review your details.');
    } finally {
      setSubmitting(false);
    }
  };

  // If order was successfully created, show confirmation screen
  if (completedOrder) {
    return (
      <div className="container" style={{ padding: '60px 20px 100px' }}>
        <div className="order-success-card animate-fade">
          <div className="success-icon-badge">
            <CheckCircle size={44} />
          </div>

          <span className="badge badge-gold" style={{ marginBottom: '14px' }}>
            Order Placed Successfully
          </span>

          <h2 style={{ fontSize: '32px', color: 'var(--primary)', marginBottom: '8px' }}>
            Thank You For Choosing ChaCeylon!
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '24px' }}>
            Your order has been recorded in our MySQL database and is being prepared for packaging.
          </p>

          <div style={{
            background: 'var(--bg-parchment)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'left',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order Reference:</span>
              <strong style={{ fontFamily: 'monospace', fontSize: '16px', color: 'var(--primary)' }}>
                {completedOrder.order_number || `ORD-2026-${completedOrder.id}`}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Server Calculated Total:</span>
              <strong style={{ fontSize: '18px', color: 'var(--primary)' }}>
                LKR {Number(completedOrder.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
              <strong style={{ textTransform: 'uppercase' }}>
                {completedOrder.payment_method?.replace(/_/g, ' ')}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Recipient:</span>
              <span>{completedOrder.delivery_address?.recipient_name} ({completedOrder.delivery_address?.city})</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-primary btn-lg">
              View In Order History <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn btn-outline btn-lg">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="container">
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '34px', color: 'var(--primary)', marginBottom: '8px' }}>Delivery & Checkout</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Provide your Sri Lankan shipping address to place order via Express API (POST /api/orders)
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={20} />
            <div>
              <strong>Error placing order:</strong> {errorMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="checkout-grid">
          {/* Left Form: Delivery Address */}
          <div className="form-card">
            <h3 style={{ fontSize: '20px', color: 'var(--primary)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              1. Delivery Information
            </h3>

            <div className="form-group">
              <label>Full Name / Recipient</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Kavindu Wijerathna"
              />
            </div>

            <div className="form-group">
              <label>Contact Phone (Sri Lanka)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0771234567"
              />
            </div>

            <div className="form-group">
              <label>Delivery Address Line 1</label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="No, Street Name / House"
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Galle, Kandy, Colombo"
                />
              </div>

              <div className="form-group">
                <label>District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Galle">Galle</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Nuwara Eliya">Nuwara Eliya</option>
                  <option value="Matara">Matara</option>
                  <option value="Kurunegala">Kurunegala</option>
                  <option value="Badulla">Badulla</option>
                  <option value="Gampaha">Gampaha</option>
                </select>
              </div>
            </div>

            <h3 style={{ fontSize: '20px', color: 'var(--primary)', margin: '28px 0 20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              2. Payment Method
            </h3>

            <div
              className={`payment-method-box ${paymentMethod === 'cash_on_delivery' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('cash_on_delivery')}
            >
              <Banknote size={22} color="var(--primary)" />
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '15px' }}>Cash On Delivery (Islandwide)</strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Pay cash when your sealed tea package arrives at your doorstep
                </span>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'cash_on_delivery'}
                onChange={() => setPaymentMethod('cash_on_delivery')}
              />
            </div>

            <div
              className={`payment-method-box ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('bank_transfer')}
            >
              <CreditCard size={22} color="var(--primary)" />
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '15px' }}>Direct Bank Transfer</strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Transfer to Commercial Bank of Ceylon / Sampath Bank
                </span>
              </div>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'bank_transfer'}
                onChange={() => setPaymentMethod('bank_transfer')}
              />
            </div>
          </div>

          {/* Right Column: Order Review */}
          <div className="cart-summary-card">
            <h3 className="cart-summary-title">Review Items ({items.length})</h3>

            <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '20px' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
                  <img
                    src={item.image_url || '/images/ceylon-black-tea.jpg'}
                    alt={item.name}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {item.quantity} × LKR {Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>
                    LKR {(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-line">
              <span>Items Subtotal</span>
              <strong>LKR {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>

            <div className="summary-line">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={14} /> Islandwide Delivery
              </span>
              <span>
                {shippingFee === 0 ? <span style={{ color: '#059669', fontWeight: 700 }}>FREE</span> : `LKR ${shippingFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </span>
            </div>

            <div className="summary-line total">
              <span>Payable Total</span>
              <span>LKR {estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '24px' }}
              disabled={submitting}
            >
              {submitting ? 'Submitting to Express...' : 'Confirm & Place Order'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="var(--accent-gold)" /> Validated by MySQL Transaction
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
