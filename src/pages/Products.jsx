import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category_id') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    }
    loadCategories();
  }, []);

  // Sync category from URL search params
  useEffect(() => {
    const cat = searchParams.get('category_id') || '';
    setSelectedCategory(cat);
  }, [searchParams]);

  // Load products based on filters
  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedCategory) params.category_id = selectedCategory;

        const res = await getProducts(params);
        if (isMounted) {
          setProducts(res.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to retrieve products.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedCategory]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId) {
      searchParams.set('category_id', catId);
    } else {
      searchParams.delete('category_id');
    }
    setSearchParams(searchParams);
  };

  // Filter and sort products on client
  let displayProducts = [...products];

  if (onlyInStock) {
    displayProducts = displayProducts.filter((p) => p.stock_quantity > 0);
  }

  if (sortBy === 'price-asc') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    displayProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    displayProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div style={{ padding: '50px 0 100px' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-eyebrow">The Royal Estate Selection</span>
          <h1 className="section-title">Authentic Ceylon Tea Catalogue</h1>
          <p className="section-desc">
            Single-origin hand-picked orthodox tea leaves, sun-dried herbal infusions, and therapeutic Moringa wellness formulations from Sri Lanka.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="category-filter-bar">
          <button
            className={`category-tab ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-tab ${String(selectedCategory) === String(cat.id) ? 'active' : ''}`}
              onClick={() => handleCategoryChange(String(cat.id))}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search & Controls Toolbar */}
        <div className="products-toolbar">
          <div className="search-input-box">
            <Search size={18} className="search-icon-svg" />
            <input
              type="text"
              placeholder="Search by tea name or notes (e.g. Black Tea, Moringa, Chai)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="toolbar-controls">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span>In Stock Only</span>
            </label>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Product Grid / Loading / Error / Empty States */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }} className="animate-spin">🍃</div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '6px' }}>Fetching Pure Ceylon Harvest</h3>
            <p style={{ color: 'var(--text-muted)' }}>Querying REST endpoint GET /api/products...</p>
          </div>
        ) : error ? (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            margin: '40px 0'
          }}>
            <h3>Failed to load products</h3>
            <p>{error}</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '70px 20px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            margin: '20px 0'
          }}>
            <div style={{ fontSize: '42px', marginBottom: '16px' }}>🍵</div>
            <h3 style={{ fontSize: '22px', color: 'var(--primary)', marginBottom: '8px' }}>No Teas Found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 20px' }}>
              We couldn't find any tea products matching "{searchTerm}". Try clearing your filters or search for another term.
            </p>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); setOnlyInStock(false); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

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
