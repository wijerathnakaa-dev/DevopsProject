import React, { useState, useEffect } from 'react';
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  updateAdminOrderStatus
} from '../services/api';
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Package,
  Layers,
  AlertTriangle,
  RefreshCw,
  X,
  Check
} from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  // Add/Edit Product Modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    category_id: 1,
    category_name: 'Black Tea',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '/images/ceylon-black-tea.jpg'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        getAdminProducts(),
        getAdminOrders()
      ]);
      setProducts(prodRes.data || []);
      setOrders(orderRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotice = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      category_id: 1,
      category_name: 'Black Tea',
      description: '',
      price: '',
      stock_quantity: '',
      image_url: '/images/ceylon-black-tea.jpg'
    });
    setShowProductModal(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      category_id: p.category_id || 1,
      category_name: p.category_name || 'Black Tea',
      description: p.description || '',
      price: p.price,
      stock_quantity: p.stock_quantity,
      image_url: p.image_url || '/images/ceylon-black-tea.jpg'
    });
    setShowProductModal(true);
  };

  // Save Product (POST or PATCH)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: prodForm.name,
        category_id: parseInt(prodForm.category_id, 10),
        category_name: prodForm.category_name,
        description: prodForm.description,
        price: parseFloat(prodForm.price),
        stock_quantity: parseInt(prodForm.stock_quantity, 10),
        image_url: prodForm.image_url
      };

      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, payload);
        showNotice(`Updated product "${payload.name}" successfully!`);
      } else {
        await createAdminProduct(payload);
        showNotice(`Created new product "${payload.name}" successfully!`);
      }
      setShowProductModal(false);
      loadData();
    } catch (err) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  // Deactivate product (DELETE)
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate "${name}"?`)) return;
    try {
      await deleteAdminProduct(id);
      showNotice(`Product "${name}" deactivated.`);
      loadData();
    } catch (err) {
      alert(`Error deactivating: ${err.message}`);
    }
  };

  // Update order status (PATCH /admin/orders/:id/status)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateAdminOrderStatus(orderId, newStatus);
      showNotice(`Order #${orderId} status changed to ${newStatus}`);
      loadData();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const lowStockCount = products.filter((p) => p.stock_quantity <= 10 && p.is_active !== 0).length;
  const activeProductsCount = products.filter((p) => p.is_active !== 0).length;

  return (
    <div className="admin-wrapper">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header-panel">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', marginBottom: '6px' }}>
              <ShieldAlert size={18} />
              <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                DevOps Group 87 Administrator Control
              </span>
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '32px', margin: 0 }}>ChaCeylon Management Dashboard</h1>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '6px 0 0' }}>
              Connected to Express REST APIs: /api/admin/products & /api/admin/orders
            </p>
          </div>

          <button className="btn btn-outline btn-sm" onClick={loadData}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Data
          </button>
        </div>

        {statusMessage && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '12px 20px',
            borderRadius: '10px',
            marginBottom: '24px',
            fontWeight: 600
          }}>
            ✓ {statusMessage}
          </div>
        )}

        {/* Metric Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h4>Total Revenue</h4>
            <div className="stat-value" style={{ color: 'var(--accent-gold)' }}>
              LKR {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
          </div>

          <div className="admin-stat-card">
            <h4>Total Customer Orders</h4>
            <div className="stat-value">{orders.length}</div>
          </div>

          <div className="admin-stat-card">
            <h4>Active Tea Products</h4>
            <div className="stat-value">{activeProductsCount}</div>
          </div>

          <div className="admin-stat-card">
            <h4>Low Stock Alerts (≤ 10)</h4>
            <div className="stat-value" style={{ color: lowStockCount > 0 ? '#ea580c' : '#059669' }}>
              {lowStockCount}
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="admin-tabs" style={{ margin: 0 }}>
            <button
              className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Tea Catalogue ({products.length})
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Customer Orders ({orders.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <button className="btn btn-primary btn-sm" onClick={handleOpenCreate}>
              <Plus size={16} /> Add New Product
            </button>
          )}
        </div>

        {/* TAB 1: Products Table */}
        {activeTab === 'products' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price (LKR)</th>
                  <th>Stock Quantity</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const isActive = p.is_active !== 0;
                  return (
                    <tr key={p.id} style={{ opacity: isActive ? 1 : 0.5 }}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{p.id}</td>
                      <td>
                        <img
                          src={p.image_url || '/images/ceylon-black-tea.jpg'}
                          alt={p.name}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/images/ceylon-black-tea.jpg'; }}
                        />
                      </td>
                      <td>
                        <strong>{p.name}</strong>
                      </td>
                      <td>{p.category_name || 'Ceylon Tea'}</td>
                      <td style={{ fontWeight: 700 }}>
                        LKR {Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: p.stock_quantity <= 5 ? '#dc2626' : p.stock_quantity <= 15 ? '#d97706' : '#059669'
                        }}>
                          {p.stock_quantity}
                        </span>
                      </td>
                      <td>
                        {isActive ? (
                          <span className="badge badge-green">Active</span>
                        ) : (
                          <span className="badge badge-red">Deactivated</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ padding: '6px 10px' }}
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Product (PATCH /api/admin/products/:id)"
                          >
                            <Edit2 size={14} />
                          </button>
                          {isActive && (
                            <button
                              className="btn btn-outline btn-sm"
                              style={{ padding: '6px 10px', color: '#dc2626' }}
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              title="Deactivate (DELETE /api/admin/products/:id)"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Orders Table */}
        {activeTab === 'orders' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Customer</th>
                  <th>Delivery City</th>
                  <th>Items</th>
                  <th>Total (LKR)</th>
                  <th>Payment</th>
                  <th>Order Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {o.order_number || `ORD-2026-${o.id}`}
                    </td>
                    <td>{o.delivery_address?.recipient_name || 'Customer'}</td>
                    <td>{o.delivery_address?.city || 'Galle'}</td>
                    <td>{(o.items || []).length} items</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                      LKR {Number(o.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', textTransform: 'uppercase' }}>
                        {o.payment_method?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        o.status === 'delivered' ? 'badge-green' :
                        o.status === 'shipped' ? 'badge-blue' :
                        o.status === 'cancelled' ? 'badge-red' : 'badge-gold'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={o.status || 'pending'}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '13px', border: '1px solid var(--border-color)', outline: 'none' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showProductModal && (
          <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
            <div className="modal-content-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setShowProductModal(false)}>
                <X size={20} />
              </button>

              <div style={{ padding: '36px' }}>
                <h2 style={{ fontSize: '24px', color: 'var(--primary)', marginBottom: '20px' }}>
                  {editingProduct ? `Edit Tea Product #${editingProduct.id}` : 'Add New Tea Product'}
                </h2>

                <form onSubmit={handleSaveProduct}>
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      required
                      value={prodForm.name}
                      onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                      placeholder="e.g. Ceylon Spiced Chai"
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={prodForm.category_id}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          const names = { 1: 'Black Tea', 2: 'Green Tea', 3: 'Herbal Drinks', 4: 'Wellness & Extracts', 5: 'White Tea' };
                          setProdForm({ ...prodForm, category_id: val, category_name: names[val] || 'Ceylon Tea' });
                        }}
                      >
                        <option value="1">Black Tea</option>
                        <option value="2">Green Tea</option>
                        <option value="3">Herbal Drinks</option>
                        <option value="4">Wellness & Extracts</option>
                        <option value="5">White Tea</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Image Selection</label>
                      <select
                        value={prodForm.image_url}
                        onChange={(e) => setProdForm({ ...prodForm, image_url: e.target.value })}
                      >
                        <option value="/images/ceylon-black-tea.jpg">Ceylon Black Tea</option>
                        <option value="/images/ceylon-green-tea.jpg">Ceylon Green Tea</option>
                        <option value="/images/silver-tips.jpg">Silver Tips White Tea</option>
                        <option value="/images/herbal_tea.png">Artisan Herbal / Spiced Tea</option>
                        <option value="/images/moringa.jpg">Organic Moringa Extract</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Price (LKR)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={prodForm.price}
                        onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                        placeholder="1250.00"
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock Quantity</label>
                      <input
                        type="number"
                        required
                        value={prodForm.stock_quantity}
                        onChange={(e) => setProdForm({ ...prodForm, stock_quantity: e.target.value })}
                        placeholder="20"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows={3}
                      required
                      value={prodForm.description}
                      onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                      placeholder="Botanical notes, harvest origin, aroma profile..."
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setShowProductModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm">
                      {editingProduct ? 'Save Changes (PATCH)' : 'Create Product (POST)'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
