// frontend/src/pages/ShopPage.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ShoppingCart from "../components/ShoppingCart";
import ProductSearchFilter from "../components/ProductSearchFilter";
import SiteHeader from "../components/SiteHeader";
import ProductItemCard from "../components/ProductItemCard";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { useShoppingCart } from "../context/ShoppingCartContext";

function ShopPage() {
  const navigate = useNavigate();
  const cart = useShoppingCart();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Add debounced state

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // Debounce timer ref
  const debounceTimerRef = useRef(null);

  // Navigation handlers
  const handleHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert("Your cart is empty! Add some items first.");
      return;
    }
    navigate("/checkout");
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  // Debounce search term - only update after user stops typing
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    // Cleanup on unmount or search change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  // Load products when filters change (using debounced search term)
  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedSubcategory, debouncedSearchTerm, pagination.page]);

  // Reset page when search or filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [selectedCategory, selectedSubcategory, debouncedSearchTerm]);

  // Load categories and subcategories on mount
  useEffect(() => {
    loadCategoriesAndSubcategories();
  }, []);

  const loadCategoriesAndSubcategories = async () => {
    try {
      const [categoriesRes, subcategoriesRes] = await Promise.all([
        categoryService.getCategories(),
        categoryService.getSubcategories(),
      ]);

      const categoryNames =
        categoriesRes.data?.map((cat) => cat.name) || categoriesRes || [];
      const subcategoryNames =
        subcategoriesRes.data?.map((sub) => sub.name) || subcategoriesRes || [];

      setCategories(
        categoryNames.length > 0
          ? categoryNames
          : [
              "Basketry",
              "Ceramics",
              "Textiles",
              "Woodcraft",
              "Wall Decor",
              "Tableware",
            ],
      );
      setSubcategories(
        subcategoryNames.length > 0
          ? subcategoryNames
          : [
              "Storage Baskets",
              "Decor Vases",
              "Macrame Art",
              "Mugs",
              "Scarves",
              "Serving Bowls",
            ],
      );
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([
        "Basketry",
        "Ceramics",
        "Textiles",
        "Woodcraft",
        "Wall Decor",
        "Tableware",
      ]);
      setSubcategories([
        "Storage Baskets",
        "Decor Vases",
        "Macrame Art",
        "Mugs",
        "Scarves",
        "Serving Bowls",
      ]);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page: pagination.page,
        limit: 20,
      };

      if (selectedCategory !== "All") {
        filters.category = selectedCategory;
      }

      if (selectedSubcategory !== "All") {
        filters.subcategory = selectedSubcategory;
      }

      if (debouncedSearchTerm.trim()) { // Use debounced search term
        filters.search = debouncedSearchTerm.trim();
      }

      console.log("🔍 Loading products with filters:", filters);

      const response = await productService.getProducts(filters);
      const data = response.data || response || [];
      const transformedProducts = data.map((product) => ({
        id: product._id || product.id,
        _id: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        stock: product.stock,
        img: product.img,
        images: product.images || [],
        isActive: product.isActive,
      }));

      setProducts(transformedProducts);
      setPagination(
        response.pagination || { page: 1, totalPages: 1, total: 0 },
      );
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value); // This triggers the debounce
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("All");
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      alert("Sorry, this product is out of stock!");
      return;
    }

    const cartItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      stock: product.stock,
      category: product.category,
      quantity: 1
    };
    
    cart.addToCart(cartItem, 1);
  };

  // Loading Skeleton
  if (loading && products.length === 0) {
    return (
      <main className="site-shell">
        <SiteHeader cartCount={cart.count} onHome={handleHome} onLogout={handleLogout} isStore />
        <div style={{ 
          maxWidth: "1180px", 
          margin: "0 auto", 
          padding: "40px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          {[1,2,3,4,5,6].map((n) => (
            <div key={n} style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              animation: "pulse 1.5s ease-in-out infinite"
            }}>
              <div style={{ height: "250px", background: "#f0ece6" }}></div>
              <div style={{ padding: "20px" }}>
                <div style={{ height: "20px", background: "#f0ece6", borderRadius: "8px", marginBottom: "10px" }}></div>
                <div style={{ height: "15px", background: "#f0ece6", borderRadius: "8px", width: "60%" }}></div>
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="site-shell">
      <SiteHeader
        cartCount={cart.count}
        onHome={handleHome}
        onLogout={handleLogout}
        isStore
      />

      {/* Hero Banner */}
      <div style={{
        background: "linear-gradient(135deg, #f6eadb 0%, #e8d5c4 100%)",
        padding: "60px 20px 80px",
        marginBottom: "40px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center"
        }}>
          <div>
            <span style={{
              display: "inline-block",
              background: "#b85c38",
              color: "white",
              padding: "6px 16px",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: "bold",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "16px"
            }}>
              ✨ Handcrafted with Love
            </span>
            <h1 style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              color: "#241913",
              margin: "0 0 16px",
              fontFamily: "Georgia, serif",
              lineHeight: "1.1"
            }}>
              Discover <br />Handmade Treasures
            </h1>
            <p style={{
              fontSize: "1.1rem",
              color: "#4c4039",
              maxWidth: "400px",
              margin: "0 0 24px",
              lineHeight: "1.6"
            }}>
              Each piece tells a story of craftsmanship, tradition, and love. 
              Explore our curated collection of authentic handmade products.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleViewOrders}
                style={{
                  padding: "12px 28px",
                  background: "#b85c38",
                  color: "white",
                  border: "none",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  boxShadow: "0 8px 24px rgba(184, 92, 56, 0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 32px rgba(184, 92, 56, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 24px rgba(184, 92, 56, 0.3)";
                }}
              >
                📋 My Orders
              </button>
              <button
                onClick={() => document.querySelector('.product-grid')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: "12px 28px",
                  background: "rgba(255,255,255,0.8)",
                  color: "#241913",
                  border: "2px solid #b85c38",
                  borderRadius: "999px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#b85c38";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.8)";
                  e.target.style.color = "#241913";
                }}
              >
                Browse Products ↓
              </button>
            </div>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            position: "relative"
          }}>
            <div style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "20px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.8)"
            }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>🏺</div>
              <div style={{ fontWeight: "bold", color: "#241913" }}>Handmade</div>
              <div style={{ fontSize: "0.85rem", color: "#71635b" }}>100% Authentic</div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "20px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.8)"
            }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>🌿</div>
              <div style={{ fontWeight: "bold", color: "#241913" }}>Natural</div>
              <div style={{ fontSize: "0.85rem", color: "#71635b" }}>Eco-Friendly</div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "20px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.8)"
            }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>🎁</div>
              <div style={{ fontWeight: "bold", color: "#241913" }}>Gift Ready</div>
              <div style={{ fontSize: "0.85rem", color: "#71635b" }}>Perfect for Gifting</div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "20px",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.8)"
            }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>💝</div>
              <div style={{ fontWeight: "bold", color: "#241913" }}>Artisan</div>
              <div style={{ fontSize: "0.85rem", color: "#71635b" }}>Support Local</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        maxWidth: "1180px",
        margin: "-40px auto 40px",
        padding: "0 20px",
        position: "relative",
        zIndex: "2"
      }}>
        <div style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          padding: "24px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "20px",
          textAlign: "center"
        }}>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#b85c38" }}>
              {pagination.total || products.length}
            </div>
            <div style={{ color: "#71635b", fontSize: "0.9rem" }}>Products</div>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#b85c38" }}>
              {categories.length}
            </div>
            <div style={{ color: "#71635b", fontSize: "0.9rem" }}>Collections</div>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#b85c38" }}>
              {cart.count}
            </div>
            <div style={{ color: "#71635b", fontSize: "0.9rem" }}>In Cart</div>
          </div>
          <div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#b85c38" }}>
              {products.filter(p => p.stock > 0).length}
            </div>
            <div style={{ color: "#71635b", fontSize: "0.9rem" }}>In Stock</div>
          </div>
        </div>
      </div>

      <ShoppingCart cart={cart} onCheckout={handleCheckout} />

      <ProductSearchFilter
        categories={categories}
        subcategories={subcategories}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        onSearchChange={handleSearchChange}
        onSelectCategory={handleCategorySelect}
        onSelectSubcategory={handleSubcategorySelect}
      />

      {error && !loading && (
        <div className="empty-products" style={{ borderColor: "#8d261a" }}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>❌</div>
            <p style={{ color: "#8d261a" }}>{error}</p>
            <button
              onClick={loadProducts}
              style={{
                marginTop: "12px",
                padding: "8px 20px",
                background: "#b85c38",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && products.length === 0 ? (
        <div className="empty-products">
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ color: "#241913", marginBottom: "8px" }}>No products found</h3>
            <p style={{ color: "#71635b" }}>
              {debouncedSearchTerm ? `No products matching "${debouncedSearchTerm}"` : "Try another search or choose All categories."}
            </p>
          </div>
        </div>
      ) : (
        !loading &&
        !error && (
          <>
            <section className="product-grid" aria-label="Featured products">
              {products.map((product) => (
                <ProductItemCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </section>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  padding: "20px 0 60px",
                  width: "min(1180px, calc(100% - 32px))",
                  margin: "0 auto",
                  flexWrap: "wrap"
                }}
              >
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    background: "white",
                    cursor: pagination.page === 1 ? "not-allowed" : "pointer",
                    opacity: pagination.page === 1 ? 0.5 : 1,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (pagination.page !== 1) {
                      e.target.style.background = "#b85c38";
                      e.target.style.color = "white";
                      e.target.style.borderColor = "#b85c38";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pagination.page !== 1) {
                      e.target.style.background = "white";
                      e.target.style.color = "inherit";
                      e.target.style.borderColor = "#ddd";
                    }
                  }}
                >
                  ← Previous
                </button>

                <div style={{
                  display: "flex",
                  gap: "6px",
                  alignItems: "center"
                }}>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        style={{
                          padding: "8px 16px",
                          border: pagination.page === pageNum ? "2px solid #b85c38" : "1px solid #ddd",
                          borderRadius: "8px",
                          background: pagination.page === pageNum ? "#b85c38" : "white",
                          color: pagination.page === pageNum ? "white" : "#241913",
                          fontWeight: pagination.page === pageNum ? "bold" : "normal",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          minWidth: "40px"
                        }}
                        onMouseEnter={(e) => {
                          if (pagination.page !== pageNum) {
                            e.target.style.background = "#f6eadb";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (pagination.page !== pageNum) {
                            e.target.style.background = "white";
                          }
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    background: "white",
                    cursor: pagination.page === pagination.totalPages ? "not-allowed" : "pointer",
                    opacity: pagination.page === pagination.totalPages ? 0.5 : 1,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (pagination.page !== pagination.totalPages) {
                      e.target.style.background = "#b85c38";
                      e.target.style.color = "white";
                      e.target.style.borderColor = "#b85c38";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pagination.page !== pagination.totalPages) {
                      e.target.style.background = "white";
                      e.target.style.color = "inherit";
                      e.target.style.borderColor = "#ddd";
                    }
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )
      )}
    </main>
  );
}

export default ShopPage;