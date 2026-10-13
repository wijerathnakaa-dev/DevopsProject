import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';
import { Package, Calendar, Clock, MapPin, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'delivered':
        return <span className="badge badge-green">Delivered</span>;
      case 'shipped':
        return <span className="badge badge-blue">Shipped</span>;
      case 'processing':
      case 'confirmed':
        return <span className="badge badge-gold">{s.toUpperCase()}</span>;
      case 'cancelled':
        return <span className="badge badge-red">Cancelled</span>;
      default:
        return <span className="badge badge-gold">Pending</span>;
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => (o.status || '').toLowerCase() === filterStatus);

  return (
    <div className="orders-page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '34px', color: 'var(--primary)', marginBottom: '8px' }}>Customer Order History</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Track your authentic Ceylon tea orders (GET /api/orders/my-orders)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={fetchOrders}
              title="Refresh orders from backend"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <Link to="/products" className="btn btn-primary btn-sm">
              New Tea Order <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              className={`category-tab ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
              style={{ textTransform: 'capitalize', padding: '6px 16px', fontSize: '13px' }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Loading / Error / Empty States */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '70px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }} className="animate-spin">🍃</div>
            <h3 style={{ color: 'var(--primary)' }}>Retrieving Orders from MySQL Database...</h3>
          </div>
        ) : error ? (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '24px', borderRadius: '12px' }}>
            <p>{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <Package size={48} color="var(--accent-gold)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>No Orders Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              You don't have any orders with status "{filterStatus}".
            </p>
            <Link to="/products" className="btn btn-primary">
              Browse Teas & Place Order
            </Link>
          </div>
        ) : (
          <div>
            {filteredOrders.map((order) => {
              const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={order.id} className="order-history-card">
                  <div className="order-header-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'var(--primary-subtle)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Package size={22} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '16px', color: 'var(--primary)' }}>
                          {order.order_number || `ORD-2026-${order.id}`}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={13} /> {formattedDate}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {getStatusBadge(order.status)}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Amount</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>
                          LKR {Number(order.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div style={{ padding: '12px 0 16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.05em' }}>
                      Enclosed Tea Products:
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                      {(order.items || []).map((it, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          background: '#faf8f5',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)'
                        }}>
                          <img
                            src={it.image_url || '/images/ceylon-black-tea.jpg'}
                            alt={it.name}
                            style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = '/images/ceylon-black-tea.jpg'; }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {it.name || 'Pure Ceylon Tea'}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              Qty: <strong>{it.quantity}</strong> × LKR {Number(it.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & Payment Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--border-color)',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={15} color="var(--accent-gold)" />
                      <span>
                        Deliver to: <strong>{order.delivery_address?.recipient_name}</strong> ({order.delivery_address?.address_line1}, {order.delivery_address?.city})
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-gold" style={{ textTransform: 'capitalize', fontSize: '11px' }}>
                        {order.payment_method?.replace(/_/g, ' ')}
                      </span>
                      <span>Payment: <strong>{order.payment_status || 'Pending'}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
