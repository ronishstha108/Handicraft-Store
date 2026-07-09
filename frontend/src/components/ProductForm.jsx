// frontend/src/components/ProductForm.jsx
import { useState, useEffect } from "react";

function ProductForm({
  product,
  categories,
  subcategories,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    description: "",
    stock: "",
    img: "",
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  // Initialize form when product prop changes
  useEffect(() => {
    if (product) {
      // When editing, get the category and subcategory values
      const categoryId = getCategoryIdFromProduct(product);
      const subcategoryId = getSubcategoryIdFromProduct(product);
      
      setFormData({
        name: product.name || "",
        price: product.price || "",
        category: categoryId || "",
        subcategory: subcategoryId || "",
        description: product.description || "",
        stock: product.stock || "",
        img: product.img || "",
      });
      setImagePreview(product.img || "");
    } else {
      // Reset form for new product
      setFormData({
        name: "",
        price: "",
        category: "",
        subcategory: "",
        description: "",
        stock: "",
        img: "",
      });
      setImagePreview("");
    }
  }, [product]);

  // Helper to get category ID from product
  const getCategoryIdFromProduct = (product) => {
    if (!product) return "";
    
    // If category is already an ID string
    if (typeof product.category === 'string') {
      return product.category;
    }
    
    // If category is an object with _id
    if (product.category && typeof product.category === 'object') {
      return product.category._id || product.category.id || "";
    }
    
    return "";
  };

  // Helper to get subcategory ID from product
  const getSubcategoryIdFromProduct = (product) => {
    if (!product) return "";
    
    // If subcategory is already an ID string
    if (typeof product.subcategory === 'string') {
      return product.subcategory;
    }
    
    // If subcategory is an object with _id
    if (product.subcategory && typeof product.subcategory === 'object') {
      return product.subcategory._id || product.subcategory.id || "";
    }
    
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Update image preview when img field changes
    if (name === "img") {
      setImagePreview(value);
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory)
      newErrors.subcategory = "Subcategory is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.stock && formData.stock !== 0) newErrors.stock = "Stock quantity is required";
    if (parseInt(formData.stock) < 0)
      newErrors.stock = "Stock cannot be negative";
    if (!formData.img) newErrors.img = "Image URL is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Prepare data for submission
    const submitData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category, // This is the category ID
      subcategory: formData.subcategory, // This is the subcategory ID
      description: formData.description,
      stock: parseInt(formData.stock),
      img: formData.img,
    };
    
    console.log("📝 Submitting product data:", submitData);
    onSubmit(submitData);
  };

  // Helper function to get category ID
  const getCategoryId = (category) => {
    if (typeof category === "object" && category !== null) {
      return category._id || category.id || category.name;
    }
    return category;
  };

  // Helper function to get category name for display
  const getCategoryName = (category) => {
    if (typeof category === "object" && category !== null) {
      return category.name || category._id || category.id;
    }
    return category;
  };

  // Helper function to get subcategory ID
  const getSubcategoryId = (subcategory) => {
    if (typeof subcategory === "object" && subcategory !== null) {
      return subcategory._id || subcategory.id || subcategory.name;
    }
    return subcategory;
  };

  // Helper function to get subcategory name for display
  const getSubcategoryName = (subcategory) => {
    if (typeof subcategory === "object" && subcategory !== null) {
      return subcategory.name || subcategory._id || subcategory.id;
    }
    return subcategory;
  };

  // Filter subcategories based on selected category
  const getFilteredSubcategories = () => {
    if (!formData.category) return subcategories || [];
    
    return (subcategories || []).filter(sub => {
      // Check if subcategory belongs to selected category
      const subCategory = sub.category;
      if (typeof subCategory === 'object') {
        return subCategory._id === formData.category || subCategory.id === formData.category;
      }
      return subCategory === formData.category;
    });
  };

  const filteredSubcategories = getFilteredSubcategories();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "24px",
        }}
      >
        <h2 style={{ margin: "0 0 20px", color: "#241913" }}>
          {product ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.name ? "#8d261a" : "#ddd"}`,
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
            {errors.name && (
              <p
                style={{
                  color: "#8d261a",
                  fontSize: "0.85rem",
                  marginTop: "4px",
                }}
              >
                {errors.name}
              </p>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                Price (Rs.) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${errors.price ? "#8d261a" : "#ddd"}`,
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
              {errors.price && (
                <p
                  style={{
                    color: "#8d261a",
                    fontSize: "0.85rem",
                    marginTop: "4px",
                  }}
                >
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${errors.stock ? "#8d261a" : "#ddd"}`,
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
              {errors.stock && (
                <p
                  style={{
                    color: "#8d261a",
                    fontSize: "0.85rem",
                    marginTop: "4px",
                  }}
                >
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${errors.category ? "#8d261a" : "#ddd"}`,
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => {
                  const id = getCategoryId(cat);
                  const name = getCategoryName(cat);
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
              {errors.category && (
                <p
                  style={{
                    color: "#8d261a",
                    fontSize: "0.85rem",
                    marginTop: "4px",
                  }}
                >
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                Subcategory *
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${errors.subcategory ? "#8d261a" : "#ddd"}`,
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
                disabled={!formData.category}
              >
                <option value="">
                  {formData.category ? "Select Subcategory" : "Select Category First"}
                </option>
                {filteredSubcategories.map((sub) => {
                  const id = getSubcategoryId(sub);
                  const name = getSubcategoryName(sub);
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
              {errors.subcategory && (
                <p
                  style={{
                    color: "#8d261a",
                    fontSize: "0.85rem",
                    marginTop: "4px",
                  }}
                >
                  {errors.subcategory}
                </p>
              )}
              {formData.category && filteredSubcategories.length === 0 && (
                <p
                  style={{
                    color: "#d8a540",
                    fontSize: "0.85rem",
                    marginTop: "4px",
                  }}
                >
                  ⚠️ No subcategories found for this category
                </p>
              )}
            </div>
          </div>

          {/* Image URL with Preview */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Image URL *
            </label>
            <input
              type="text"
              name="img"
              value={formData.img}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.img ? "#8d261a" : "#ddd"}`,
                borderRadius: "8px",
                fontSize: "1rem",
              }}
            />
            {errors.img && (
              <p
                style={{
                  color: "#8d261a",
                  fontSize: "0.85rem",
                  marginTop: "4px",
                }}
              >
                {errors.img}
              </p>
            )}
            
            {/* Image Preview */}
            {imagePreview && (
              <div style={{ marginTop: "12px" }}>
                <p style={{ fontSize: "0.85rem", color: "#71635b", marginBottom: "8px" }}>
                  Image Preview:
                </p>
                <div style={{
                  width: "100%",
                  maxWidth: "200px",
                  height: "150px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#f9f6f0",
                }}>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      const parent = e.target.parentElement;
                      parent.innerHTML = `
                        <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:0.85rem;">
                          ❌ Invalid URL
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${errors.description ? "#8d261a" : "#ddd"}`,
                borderRadius: "8px",
                fontFamily: "inherit",
                fontSize: "1rem",
              }}
            />
            {errors.description && (
              <p
                style={{
                  color: "#8d261a",
                  fontSize: "0.85rem",
                  marginTop: "4px",
                }}
              >
                {errors.description}
              </p>
            )}
          </div>

          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "10px 20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "white",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                background: "#b85c38",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;