import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Shield, CheckCircle, AlertTriangle, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { subscribeBackendStatus } from '../services/api';
import ApiStatusModal from './ApiStatusModal';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout, toggleRole } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const [backendStatus, setBackendStatus] = useState({ online: false, url: '' });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    return subscribeBackendStatus((status) => {
      setBackendStatus(status);
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <span>🍃 <strong>Pure Ceylon Heritage:</strong> Single-Origin Orthodox Teas & Artisan Herbal Elixirs</span>
        <span>•</span>
        <span>Free islandwide delivery across Sri Lanka for orders above <span className="highlight">LKR 5,000</span></span>
      </div>

      {/* Main Sticky Navbar */}
      <nav className="navbar-wrapper">
        <div className="container navbar-container">
          {/* Brand Logo & Title */}
          <Link to="/" className="brand-link">
            <img
              src="/images/logo.png"
              alt="Cha Ceylon Nature's Blend Logo"
              className="brand-logo-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="brand-text-block">
              <span className="brand-name">ChaCeylon</span>
              <span className="brand-tagline">Nature's Blend</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Tea Collection
              </NavLink>
            </li>
            <li>
              <a href="/#factory" className="nav-link">
                Factory & Craft
              </a>
            </li>
            <li>
              <NavLink to="/orders" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                My Orders
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} style={{ color: 'var(--accent-gold)' }}>
                  Admin Portal
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Icons & Controls */}
          <div className="nav-actions">
            {/* Backend Integration Status Indicator */}
            <div
              className={`api-status-pill ${backendStatus.online ? 'online' : 'offline'}`}
              onClick={() => setShowStatusModal(true)}
              title="Click to view REST API connection details & test /api/health"
            >
              <div className="api-status-dot" />
              <span>{backendStatus.online ? 'Express Online' : 'Mock Demo'}</span>
            </div>

            {/* Role switch toggle for quick evaluation */}
            <button
              className="role-badge-btn"
              onClick={toggleRole}
              title="Click to toggle between Customer and Admin role for lab testing"
            >
              {isAdmin ? '🛡️ Admin' : '👤 Customer'}
            </button>

            {/* Shopping Cart Button */}
            <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
              <ShoppingBag size={20} />
              {totalCount > 0 && <span className="cart-badge-count">{totalCount}</span>}
            </Link>

            {/* User Account / Auth */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/orders" className="user-menu-btn" title={`Signed in as ${user.name}`}>
                  <div className="user-avatar-initial">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={handleLogout}
                  title="Logout"
                  style={{ padding: '8px' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: 'none' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Backend API Details Modal */}
      <ApiStatusModal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} />
    </>
  );
}