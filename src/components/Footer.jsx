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

          {/* DevOps Project Specification */}
          <div className="footer-col">
            <h4>DevOps Architecture</h4>
            <ul className="footer-links" style={{ fontSize: '13px' }}>
              <li><strong>Module:</strong> DevOps Engineering</li>
              <li><strong>Group No.:</strong> 87</li>
              <li><strong>Frontend:</strong> React 19 + Vite</li>
              <li><strong>Backend:</strong> Node.js + Express</li>
              <li><strong>Database:</strong> MySQL</li>
              <li><strong>Infra:</strong> Docker + K8s + AWS</li>
            </ul>
          </div>

          {/* Heritage & Contact */}
          <div className="footer-col">
            <h4>Contact & Estate</h4>
            <ul className="footer-links">
              <li style={{ color: '#9ab3a5' }}>Estate: Nuwara Eliya & Galle, Sri Lanka</li>
              <li style={{ color: '#9ab3a5' }}>Email: info@chaceylon.lk</li>
              <li style={{ color: '#9ab3a5' }}>Phone: +94 (11) 234-5678</li>
              <li style={{ marginTop: '8px' }}>
                <span className="badge badge-green" style={{ textTransform: 'none', fontSize: '12px' }}>
                  <Server size={12} /> REST API Prefix: /api
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ChaCeylon (Nature's Blend). All Rights Reserved. Group 87 DevOps Project.
          </div>
          <div>
            Built with React, Express, MySQL & Docker containerization.
          </div>
        </div>
      </div>
    </footer>
  );
}
