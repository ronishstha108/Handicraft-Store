// frontend/src/components/ProductItemCard.jsx
function ProductItemCard({ product, onAddToCart, onViewDetails }) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleViewDetails = () => {
    if (onViewDetails) onViewDetails(product);
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
    e.target.alt = 'Image not available';
  };

  return (
    <article
      className="product-card"
      onClick={handleViewDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleViewDetails();
        }
      }}
      style={{
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        cursor: "pointer"
      }}>      <div className="product-image" style={{ position: "relative" }}>
        <img 
          src={product.img || 'https://via.placeholder.com/300x300?text=No+Image'} 
          alt={product.name || 'Product'} 
          style={{
            transition: "transform 0.5s ease",
            width: "100%",
            height: "300px",
            objectFit: "cover",
            background: "#f9f6f0"
          }}
          onError={handleImageError}
        />
        <div style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          display: "flex",
          gap: "6px",
          flexWrap: "wrap"
        }}>
          <span style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "999px",
            background: "rgba(36, 25, 19, 0.7)",
            color: "white",
            fontSize: "0.75rem",
            fontWeight: "bold",
            backdropFilter: "blur(8px)"
          }}>
            {/* ✅ Display category name here - this is the fix */}
            {product.category || "Uncategorized"}
          </span>
          {isLowStock && !isOutOfStock && (
            <span style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "999px",
              background: "#d8a540",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: "bold"
            }}>
              Low Stock
            </span>
          )}
          {isOutOfStock && (
            <span style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "999px",
              background: "#8d261a",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: "bold"
            }}>
              Sold Out
            </span>
          )}
        </div>
      </div>
      
      <div className="product-body" style={{ padding: "20px" }}>
        <h2 style={{
          margin: "0 0 6px",
          fontSize: "1.1rem",
          color: "#241913",
          fontWeight: "bold"
        }}>
          {product.name || "Unnamed Product"}
        </h2>
        {/* ✅ Display subcategory name here */}
        <p className="product-subcategory" style={{
          margin: "0 0 8px",
          color: "#b85c38",
          fontSize: "0.85rem",
          fontWeight: "600"
        }}>
          {product.subcategory || "Uncategorized"}
        </p>
        <p style={{
          color: "#71635b",
          fontSize: "0.9rem",
          lineHeight: "1.5",
          margin: "0 0 12px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {product.description || "No description available"}
        </p>
        
        <div className="product-footer" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "16px",
          paddingTop: "16px",
          borderTop: "1px solid rgba(36, 25, 19, 0.08)"
        }}>
          <div>
            <div style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#b85c38"
            }}>
              Rs. {product.price?.toLocaleString("en-IN") || 0}
            </div>
            <div style={{
              fontSize: "0.75rem",
              color: isOutOfStock ? "#8d261a" : isLowStock ? "#d8a540" : "#456b55"
            }}>
              {isOutOfStock ? "Out of stock" : isLowStock ? `Only ${product.stock} left` : `${product.stock} available`}
            </div>
          </div>
          <button 
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "999px",
              background: isOutOfStock ? "#ddd" : "#b85c38",
              color: isOutOfStock ? "#999" : "white",
              fontWeight: "bold",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              fontSize: "0.9rem"
            }}
            onMouseEnter={(e) => {
              if (!isOutOfStock) {
                e.target.style.background = "#8d3f25";
                e.target.style.transform = "scale(1.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isOutOfStock) {
                e.target.style.background = "#b85c38";
                e.target.style.transform = "scale(1)";
              }
            }}
          >
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductItemCard;