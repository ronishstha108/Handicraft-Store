// frontend/src/components/ProductDetailModal.jsx
import { useState, useEffect } from "react";

function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
    e.target.alt = 'Image not available';
  };

  const clampQuantity = (value) => {
    if (Number.isNaN(value)) return 1;
    return Math.min(Math.max(value, 1), product.stock);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(clampQuantity(value));
  };

  const incrementQuantity = () => {
    setQuantity((q) => clampQuantity(q + 1));
  };

  const decrementQuantity = () => {
    setQuantity((q) => clampQuantity(q - 1));
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(36, 25, 19, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px',
          maxWidth: '820px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          position: 'relative'
        }}
        className="product-detail-modal"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(36, 25, 19, 0.7)',
            color: 'white',
            fontSize: '1.1rem',
            cursor: 'pointer',
            zIndex: 2
          }}
        >
          ✕
        </button>

        <div style={{ background: '#f9f6f0' }}>
          <img
            src={product.img || 'https://via.placeholder.com/500x500?text=No+Image'}
            alt={product.name || 'Product'}
            onError={handleImageError}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '320px',
              objectFit: 'cover'
            }}
          />
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '999px',
              background: '#f6eadb',
              color: '#8d3f25',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {product.category || 'Uncategorized'}
            </span>
            <span style={{
              padding: '4px 12px',
              borderRadius: '999px',
              background: '#f6eadb',
              color: '#8d3f25',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {product.subcategory || 'Uncategorized'}
            </span>
          </div>

          <h1 style={{
            margin: '0 0 10px',
            fontSize: '1.6rem',
            color: '#241913',
            fontFamily: 'Georgia, serif'
          }}>
            {product.name || 'Unnamed Product'}
          </h1>

          <div style={{
            fontSize: '1.6rem',
            fontWeight: 'bold',
            color: '#b85c38',
            marginBottom: '12px'
          }}>
            Rs. {product.price?.toLocaleString('en-IN') || 0}
          </div>

          <div style={{
            fontSize: '0.9rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: isOutOfStock ? '#8d261a' : isLowStock ? '#d8a540' : '#456b55'
          }}>
            {isOutOfStock
              ? 'Out of stock'
              : isLowStock
              ? `Only ${product.stock} left in stock`
              : `${product.stock} available`}
          </div>

          <p style={{
            color: '#4c4039',
            fontSize: '0.95rem',
            lineHeight: '1.7',
            marginBottom: '28px'
          }}>
            {product.description || 'No description available for this product.'}
          </p>

          {!isOutOfStock && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: '#4c4039',
                marginBottom: '8px'
              }}>
                Quantity
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <button
                  type="button"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    background: quantity <= 1 ? '#f2f2f2' : 'white',
                    color: '#4c4039',
                    fontSize: '1.1rem',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  −
                </button>

                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  onFocus={(e) => e.target.select()}
                  onClick={(e) => e.target.select()}
                  aria-label="Quantity"
                  style={{
                    width: '70px',
                    height: '38px',
                    textAlign: 'center',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />

                <button
                  type="button"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    border: '1px solid #ddd',
                    background: quantity >= product.stock ? '#f2f2f2' : 'white',
                    color: '#4c4039',
                    fontSize: '1.1rem',
                    cursor: quantity >= product.stock ? 'not-allowed' : 'pointer'
                  }}
                >
                  +
                </button>

                <span style={{ fontSize: '0.8rem', color: '#8a7c72' }}>
                  ({product.stock} available)
                </span>
              </div>
            </div>
          )}

          <button
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              borderRadius: '999px',
              background: isOutOfStock ? '#ddd' : '#b85c38',
              color: isOutOfStock ? '#999' : 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {isOutOfStock ? 'Unavailable' : `Add ${quantity} to Cart`}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .product-detail-modal {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductDetailModal;
