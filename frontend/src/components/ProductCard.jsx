import React from 'react';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;

  const formattedPrice = Number(product.price).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="tea-card product-card">
      <div className="product-image-container">
        <img
          src={product.image_url || '/images/ceylon-black-tea.jpg'}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/ceylon-black-tea.jpg';
          }}
        />

        {product.badge && (
          <div className="product-badge-overlay">
            <span className="badge badge-gold">{product.badge}</span>
          </div>
        )}

        <div
          className={`product-stock-tag ${
            isOutOfStock ? 'out-stock' : isLowStock ? 'low-stock' : 'in-stock'
          }`}
        >
          {isOutOfStock
            ? 'Out of Stock'
            : isLowStock
            ? `Only ${product.stock_quantity} Left`
            : `In Stock (${product.stock_quantity})`}
        </div>
      </div>

      <div className="product-card-body">
        <span className="product-category-name">{product.category_name || 'Ceylon Tea'}</span>

        <h3
          className="product-name-link"
          onClick={() => onQuickView && onQuickView(product)}
          title={product.name}
        >
          {product.name}
        </h3>

        <p className="product-snippet">{product.description}</p>

        <div className="product-card-footer">
          <div className="product-price-block">
            <span className="product-currency">{product.currency || 'LKR'}</span>
            <span className="product-price">{formattedPrice}</span>
          </div>

          <div className="product-actions-group">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onQuickView && onQuickView(product)}
              title="Quick View"
              style={{ padding: '8px 12px' }}
            >
              <Eye size={16} />
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              style={{ opacity: isOutOfStock ? 0.6 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
            >
              <ShoppingBag size={16} />
              <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
