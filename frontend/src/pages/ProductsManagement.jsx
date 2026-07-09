// frontend/src/pages/ProductsManagement.jsx
import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import ProductForm from '../components/ProductForm';

function ProductsManagement() {
  const { products, categories, subcategories, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to get category name from ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Uncategorized';
    
    // If it's already a string name (like "Textiles")
    if (typeof categoryId === 'string' && !categoryId.match(/^[0-9a-fA-F]{24}$/)) {
      return categoryId;
    }
    
    // Find category by ID
    const category = categories.find(cat => {
      const catId = cat._id || cat.id;
      return catId === categoryId;
    });
    
    return category ? (category.name || categoryId) : 'Unknown Category';
  };

  // Helper function to get subcategory name from ID
  const getSubcategoryName = (subcategoryId) => {
    if (!subcategoryId) return 'Uncategorized';
    
    // If it's already a string name
    if (typeof subcategoryId === 'string' && !subcategoryId.match(/^[0-9a-fA-F]{24}$/)) {
      return subcategoryId;
    }
    
    // Find subcategory by ID
    const subcategory = subcategories.find(sub => {
      const subId = sub._id || sub.id;
      return subId === subcategoryId;
    });
    
    return subcategory ? (subcategory.name || subcategoryId) : 'Unknown Subcategory';
  };

  const filteredProducts = (products || []).filter(product => {
    const productName = product.name?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    const categoryName = getCategoryName(product.category).toLowerCase();
    
    return productName.includes(search) || categoryName.includes(search);
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDelete = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      deleteProduct(productId);
    }
  };

  const handleSubmit = (productData) => {
    if (editingProduct) {
      const id = editingProduct._id || editingProduct.id;
      updateProduct(id, productData);
    } else {
      addProduct(productData);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Helper function to handle image error
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
    e.target.alt = 'Image not found';
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ margin: 0, color: "#241913" }}>Products Management</h2>
          <p style={{ margin: "4px 0 0", color: "#71635b" }}>Add, edit, or remove products from your store</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: "8px", width: "200px" }} 
          />
          <button 
            onClick={() => { setEditingProduct(null); setShowProductForm(true); }} 
            style={{ padding: "8px 20px", background: "#b85c38", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
          >
            + Add New Product
          </button>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", border: "1px solid rgba(36, 25, 19, 0.12)", overflow: "auto" }}>
        {filteredProducts.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#71635b" }}>
            No products found. Click "Add New Product" to get started.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f6eadb" }}>
              <tr>
                <th style={{ padding: "16px", textAlign: "left" }}>Image</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Category</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Subcategory</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Price</th>
                <th style={{ padding: "16px", textAlign: "center" }}>Stock</th>
                <th style={{ padding: "16px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const productId = product._id || product.id;
                const categoryName = getCategoryName(product.category);
                const subcategoryName = getSubcategoryName(product.subcategory);
                
                return (
                  <tr key={productId} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px" }}>
                      <img 
                        src={product.img || 'https://via.placeholder.com/50x50?text=No+Image'} 
                        alt={product.name || 'Product'} 
                        style={{ 
                          width: "50px", 
                          height: "50px", 
                          borderRadius: "8px", 
                          objectFit: "cover",
                          background: "#f9f6f0"
                        }} 
                        onError={handleImageError}
                      />
                    </td>
                    <td style={{ padding: "12px", fontWeight: "500" }}>{product.name || 'Unnamed'}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 12px",
                        borderRadius: "12px",
                        background: "#f6eadb",
                        color: "#b85c38",
                        fontSize: "0.85rem"
                      }}>
                        {categoryName}
                      </span>
                    </td>
                    <td style={{ padding: "12px", color: "#71635b", fontSize: "0.9rem" }}>
                      {subcategoryName}
                    </td>
                    <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>
                      Rs. {product.price?.toLocaleString("en-IN") || 0}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <span style={{ 
                        padding: "4px 12px", 
                        borderRadius: "999px", 
                        background: product.stock === 0 ? "#ffe8df" : product.stock <= 5 ? "#fff8e7" : "#e8f3ef",
                        color: product.stock === 0 ? "#8d261a" : product.stock <= 5 ? "#d8a540" : "#2f5140",
                        fontSize: "0.85rem"
                      }}>
                        {product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? `Low (${product.stock})` : `${product.stock} left`}
                      </span>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button 
                        onClick={() => handleEdit(product)} 
                        style={{ 
                          padding: "6px 12px", 
                          marginRight: "8px", 
                          background: "#456b55", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "6px", 
                          cursor: "pointer" 
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(productId, product.name)} 
                        style={{ 
                          padding: "6px 12px", 
                          background: "#8d261a", 
                          color: "white", 
                          border: "none", 
                          borderRadius: "6px", 
                          cursor: "pointer" 
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showProductForm && (
        <ProductForm 
          product={editingProduct} 
          categories={categories || []} 
          subcategories={subcategories || []} 
          onSubmit={handleSubmit} 
          onCancel={() => { 
            setShowProductForm(false); 
            setEditingProduct(null); 
          }} 
        />
      )}
    </div>
  );
}

export default ProductsManagement;