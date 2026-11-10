import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Award, Heart } from 'lucide-react';
import company, { phoneHref, whatsappHref, emailHref } from '../config/company';

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
                alt={`${company.shortName} Logo`}
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
            <p>{company.summary}</p>
            <p style={{ color: 'var(--accent-gold)', fontSize: '13px', letterSpacing: '0.05em' }}>{company.tagline}</p>
            <div style={{ display: 'flex', gap: '14px', color: 'var(--accent-gold)' }}>
              <span title="Export-Quality Standards"><Award size={20} /></span>
              <span title="Natural Sri Lankan Ingredients"><Leaf size={20} /></span>
              <span title="Hygienic Manufacturing"><ShieldCheck size={20} /></span>
              <span title="Supporting Local Agriculture"><Heart size={20} /></span>
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
              <li><Link to="/about">About {company.shortName}</Link></li>
              <li><Link to="/login">My Account</Link></li>
            </ul>
          </div>

          {/* Heritage & Contact */}
          <div className="footer-col">
            <h4>Get In Touch</h4>
            <ul className="footer-links">
              <li style={{ color: '#9ab3a5' }}>{company.address}</li>
              <li><a href={emailHref}>{company.email}</a></li>
              {phoneHref && <li><a href={phoneHref}>{company.phone}</a></li>}
              {whatsappHref && <li><a href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>}
              {company.hours.map((h) => (
                <li key={h.days} style={{ color: '#9ab3a5' }}>{h.days}: {h.time}</li>
              ))}
              <li><Link to="/about#contact">Contact page</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} {company.name}. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>Islandwide Delivery</span>
            <span>•</span>
            <span>Made in Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
