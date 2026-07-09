import { useState } from "react";

function CategoryForm({ type, categories = [], onAdd, onCancel }) {
  const [value, setValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isSubcategory = type === "subcategory";

  const getCategoryId = (category) => {
    if (typeof category === "object" && category !== null) {
      return category._id || category.id || category.name;
    }
    return category;
  };

  const getCategoryName = (category) => {
    if (typeof category === "object" && category !== null) {
      return category.name || category._id || category.id;
    }
    return category;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!value.trim()) {
      setError("Please enter a name");
      return;
    }

    if (isSubcategory && !selectedCategory) {
      setError("Please select a parent category");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isSubcategory) {
        // Pass the category ID (not the name)
        await onAdd({
          name: value.trim(),
          category: selectedCategory, // ← This is now the ID
        });
      } else {
        await onAdd(value.trim());
      }
      setValue("");
      setSelectedCategory("");
      onCancel(); // Close the form after successful add
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          `Failed to create ${type}`,
      );
    } finally {
      setLoading(false);
    }
  };

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
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          width: "90%",
          maxWidth: "420px",
          padding: "24px",
        }}
      >
        <h2 style={{ margin: "0 0 20px", color: "#241913" }}>
          Add New {isSubcategory ? "Subcategory" : "Category"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isSubcategory && (
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                Parent Category *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setError("");
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: `1px solid ${error && !selectedCategory ? "#8d261a" : "#ddd"}`,
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
                disabled={loading}
              >
                <option value="">Select category</option>
                {categories.map((category) => {
                  const id = getCategoryId(category); // ← Get the ID
                  const name = getCategoryName(category); // ← Get the name for display
                  return (
                    <option key={id} value={id}>
                      {" "}
                      {/* ← Value is ID */}
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              {isSubcategory ? "Subcategory Name" : "Category Name"} *
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              placeholder={isSubcategory ? "e.g., Necklaces" : "e.g., Jewelry"}
              style={{
                width: "100%",
                padding: "10px",
                border: `1px solid ${error && !value.trim() ? "#8d261a" : "#ddd"}`,
                borderRadius: "8px",
                fontSize: "1rem",
              }}
              autoFocus={!isSubcategory}
              disabled={loading}
            />
            {error && (
              <p
                style={{
                  color: "#8d261a",
                  fontSize: "0.85rem",
                  marginTop: "8px",
                }}
              >
                {error}
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
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                background: loading ? "#ccc" : "#b85c38",
                color: "white",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Adding..."
                : `Add ${isSubcategory ? "Subcategory" : "Category"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryForm;
