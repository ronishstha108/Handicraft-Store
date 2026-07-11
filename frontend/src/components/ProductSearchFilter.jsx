// frontend/src/components/ProductSearchFilter.jsx
function ProductSearchFilter({
  categories,
  subcategories,
  searchTerm,
  selectedCategory,
  selectedSubcategory,
  onSearchChange,
  onSelectCategory,
  onSelectSubcategory,
}) {
  return (
    <section className="product-search-filter" aria-label="Search products">
      <div className="search-heading">
        <div>
          <p className="eyebrow">Search products</p>
          <h2>Find the craft you want</h2>
        </div>

        <label className="search-box">
          <span>Search by product name</span>
          <input
            type="search"
            placeholder="Search basket, vase, scarf..."
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
      </div>

      <div className="category-buttons">
        <button
          className={selectedCategory === "All" ? "active" : ""}
          onClick={() => {
            onSelectCategory("All");
            onSelectSubcategory("All");
          }}
        >
          All categories
        </button>
        {categories.map((category) => (
          <button
            className={selectedCategory === category ? "active" : ""}
            key={category}
            onClick={() => {
              onSelectCategory(category);
              onSelectSubcategory("All");
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="subcategory-row">
        <span>Subcategory</span>
        <select
          value={selectedSubcategory}
          onChange={(event) => onSelectSubcategory(event.target.value)}
        >
          <option value="All">All subcategories</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default ProductSearchFilter;