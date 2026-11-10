import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import company from '../config/company';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Clock,
  Truck,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await getProducts();
        if (isMounted) {
          setFeaturedProducts((res.data || []).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge">
              <Sparkles size={16} /> {company.badge}
            </div>

            <h1 className="hero-title">
              Nature's Blend <br />
              <span className="accent">for Modern Living.</span>
            </h1>

            <p className="hero-description">
              {company.heroSubtitle}. Manufacturing Sri Lankan food, beverages, spices, herbal products and natural ingredient solutions for local and global markets.
            </p>

            <div className="hero-cta-group">
              <Link to="/products" className="btn btn-accent btn-lg">
                Explore Tea Collection <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}>
                About {company.shortName}
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <h3>7</h3>
                <p>Product Ranges</p>
              </div>
              <div className="hero-stat-item">
                <h3>Export</h3>
                <p>Quality Standards</p>
              </div>
              <div className="hero-stat-item">
                <h3>Anuradhapura</h3>
                <p>Sri Lankan Manufacturer</p>
              </div>
            </div>
          </div>

          <div>
            <div className="hero-visual-card">
              <img
                src="/images/herbal_tea.png"
                alt="Artisan Ceylon Spiced Herbal Tea"
                onError={(e) => { e.target.src = '/images/ceylon-black-tea.jpg'; }}
              />
              <div className="hero-floating-seal">
                <img
                  src="/images/logo.png"
                  alt="Cha Ceylon Seal"
                  className="seal-logo"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div>
                  <h4>{company.name}</h4>
                  <p>{company.tagline}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Badges Bar */}
      <section className="trust-bar">
        <div className="container trust-grid">
          <div className="trust-item">
            <div className="trust-icon-box"><Leaf size={24} /></div>
            <div className="trust-text">
              <h4>{company.strengths[0].title}</h4>
              <p>Carefully selected Sri Lankan herbs, spices, fruits and natural ingredients</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box"><ShieldCheck size={24} /></div>
            <div className="trust-text">
              <h4>{company.strengths[1].title}</h4>
              <p>Hygienic manufacturing practices and controlled production methods</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box"><Truck size={24} /></div>
            <div className="trust-text">
              <h4>Islandwide Delivery</h4>
              <p>Free delivery on orders over LKR 5,000 across Sri Lanka</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box"><Clock size={24} /></div>
            <div className="trust-text">
              <h4>{company.strengths[2].title}</h4>
              <p>Developed for both local and international market requirements</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Tea Collection */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Curated Teas & Elixirs</span>
            <h2 className="section-title">Signature ChaCeylon Creations</h2>
            <p className="section-desc">
              From robust full-bodied orthodox black tea to delicate sunrise white tips and therapeutic Ayurvedic blends, explore our master-curated catalog.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '12px' }}>🍃</div>
              <p>Gathering fresh Ceylon harvest...</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link to="/products" className="btn btn-outline btn-lg">
              View All Teas & Herbal Drinks <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Factory & Packaging Section (Features user's factory.png) */}
      <section id="factory" className="factory-section">
        <div className="container factory-grid">
          <div className="factory-image-wrapper">
            <img
              src="/images/factory.png"
              alt={`${company.name} manufacturing facility`}
            />
            <div className="factory-image-badge">
              🏭 {company.name}, Vijithapura
            </div>
          </div>

          <div className="factory-content">
            <span className="section-eyebrow">Quality & Hygiene Standards</span>
            <h2>From Sri Lankan Farms to Quality Packaging</h2>
            <p className="lead">
              We combine traditional Sri Lankan ingredients with modern food processing and manufacturing methods to create reliable, high-quality products for local and international markets.
            </p>

            <div className="factory-features-list">
              <div className="factory-feature-item">
                <div className="feature-check-icon"><CheckCircle2 size={16} /></div>
                <div>
                  <strong>Trusted Ingredient Sourcing:</strong>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                    Carefully selected herbs, spices, grains, fruits, and natural ingredients sourced from trusted Sri Lankan suppliers.
                  </p>
                </div>
              </div>

              <div className="factory-feature-item">
                <div className="feature-check-icon"><CheckCircle2 size={16} /></div>
                <div>
                  <strong>Freshness-Preserving Packaging:</strong>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                    Packaging designed to preserve freshness, quality, and product integrity.
                  </p>
                </div>
              </div>

              <div className="factory-feature-item">
                <div className="feature-check-icon"><CheckCircle2 size={16} /></div>
                <div>
                  <strong>Export-Aligned Standards:</strong>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                    Manufacturing practices aligned with local and export market expectations, with ongoing product development and improvement.
                  </p>
                </div>
              </div>
            </div>

            <Link to="/products" className="btn btn-primary">
              Order Fresh From The Factory
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Moringa & Herbal Wellness Spotlight (Features user's moringa.jpg) */}
      <section className="wellness-section">
        <div className="container">
          <div className="wellness-banner">
            <div className="wellness-content-side">
              <span style={{ color: 'var(--accent-gold)', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Ancient Ayurvedic Superfood
              </span>
              <h2>Pure Organic Ceylon Moringa & Botanical Extracts</h2>
              <p>
                Grown in mineral-dense Sri Lankan red soils, our Moringa oleifera is sun-cured and micro-pulverized within hours of harvest. Revered for millennia as the 'Miracle Tree', it delivers 46 natural antioxidants and 9 essential amino acids to revitalize mind and body.
              </p>

              <div className="wellness-badges-row">
                <span className="wellness-badge-tag">🌿 100% Cold Processed</span>
                <span className="wellness-badge-tag">⚡ 46 Antioxidants</span>
                <span className="wellness-badge-tag">🌱 Zero Additives</span>
                <span className="wellness-badge-tag">🍵 Bioactive Polyphenols</span>
              </div>

              <div>
                <Link to="/products?category_id=4" className="btn btn-accent">
                  Discover Moringa & Wellness <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="wellness-image-side">
              <img
                src="/images/moringa.jpg"
                alt="ChaCeylon Pure Organic Moringa Leaf Extract and Leaves"
                onError={(e) => { e.target.src = '/images/herbal_tea.png'; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}