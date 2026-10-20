import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Award, Heart, Server } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src="/images/logo.png"
                alt="ChaCeylon Elephant Logo"
                style={{ height: '48px', width: 'auto', filter: 'brightness(0) invert(1)' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: '#ffffff' }}>ChaCeylon</h3>
                <span style={{ color: 'var(--accent-gold)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Nature's Blend
                </span>
              </div>
            </div>
            <p>
              Direct from misty Ceylon highlands to your teacup. We bring you handpicked orthodox single-origin teas, traditional Ayurvedic botanical blends, and laboratory-extracted organic Moringa elixirs.
            </p>
            <div style={{ display: 'flex', gap: '14px', color: 'var(--accent-gold)' }}>
              <span title="Lion Logo Authentic Quality"><Award size={20} /></span>
              <span title="100% Organically Cultivated"><Leaf size={20} /></span>
              <span title="Pure Ceylon Elephant Seal"><ShieldCheck size={20} /></span>
              <span title="Ethically Sourced & Packed"><Heart size={20} /></span>
            </div>
          </div>

          {/* Tea Collections */}
          <div className="footer-col">
            <h4>Tea Collections</h4>
            <ul className="footer-links">
              <li><Link to="/products?category_id=1">Single Estate Black Tea</Link></li>
              <li><Link to="/products?category_id=2">Ceylon Organic Green Tea</Link></li>
              <li><Link to="/products?category_id=3">Ayurvedic Herbal Infusions</Link></li>
              <li><Link to="/products?category_id=4">Organic Moringa Extracts</Link></li>
              <li><Link to="/products?category_id=5">Royal Silver Tips White Tea</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="footer-col">
            <h4>Customer Care</h4>
            <ul className="footer-links">
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/products">Fresh Ceylon Harvests</Link></li>
              <li><Link to="/cart">Shopping Basket</Link></li>
              <li><a href="#factory">Factory & Hygiene Standards</a></li>
              <li><Link to="/login">My Account</Link></li>
            </ul>
          </div>

          {/* Heritage & Contact */}
          <div className="footer-col">
            <h4>Contact & Estate</h4>
            <ul className="footer-links">
              <li style={{ color: '#9ab3a5' }}>Estates: Nuwara Eliya & Galle, Sri Lanka</li>
              <li style={{ color: '#9ab3a5' }}>Email: info@chaceylon.lk</li>
              <li style={{ color: '#9ab3a5' }}>Hotline: +94 (11) 234-5678</li>
              <li style={{ color: '#9ab3a5' }}>Hours: Mon – Sat, 8:30 AM – 6:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ChaCeylon (Nature's Blend). All Rights Reserved. Single-Origin Pure Ceylon Tea.
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>Islandwide Delivery</span>
            <span>•</span>
            <span>Authentic Ceylon Purity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
