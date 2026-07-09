// frontend/src/pages/CategoriesManagement.jsx
import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import CategoryForm from '../components/CategoryForm';

function CategoriesManagement() {
  const {
    categories,
    subcategories,
    addCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
  } = useAdmin();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);

  const getCategoryId = (category) => category?._id || category?.id || category;
  const getCategoryName = (category) => {
    if (typeof category === 'object' && category !== null) {
      return category.name || category._id || category.id;
    }
    return category;
  };

  const getSubcategoryName = (subcategory) => {
    if (typeof subcategory === 'object' && subcategory !== null) {
      return subcategory.name || subcategory._id || subcategory.id;
    }
    return subcategory;
  };

  const getSubcategoryCategoryName = (subcategory) => {
    if (!subcategory?.category) return 'No parent category';
    if (typeof subcategory.category === 'object') {
      return subcategory.category.name || 'No parent category';
    }

    const parent = (categories || []).find(
      (category) => getCategoryId(category) === subcategory.category,
    );
    return parent ? getCategoryName(parent) : 'No parent category';
  };

  const handleDeleteCategory = (category) => {
    const name = getCategoryName(category);
    if (window.confirm(`Are you sure you want to delete category "${name}"? This will affect products using this category.`)) {
      deleteCategory(getCategoryId(category));
    }
  };

  const handleDeleteSubcategory = (subcategory) => {
    const name = getSubcategoryName(subcategory);
    if (window.confirm(`Are you sure you want to delete subcategory "${name}"?`)) {
      deleteSubcategory(subcategory._id || subcategory.id || subcategory);
    }
  };

  const handleAddCategory = async (categoryName) => {
    await addCategory(categoryName);
    setShowCategoryForm(false);
  };

  const handleAddSubcategory = async (subcategoryData) => {
    await addSubcategory(subcategoryData);
    setShowSubcategoryForm(false);
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid rgba(36, 25, 19, 0.12)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0, color: '#241913' }}>Categories</h2>
              <p style={{ margin: '4px 0 0', color: '#71635b', fontSize: '0.85rem' }}>Manage product categories</p>
            </div>
            <button onClick={() => setShowCategoryForm(true)} style={{ padding: '8px 16px', background: '#b85c38', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Category</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(categories || []).map((category) => {
              const id = getCategoryId(category);
              const name = getCategoryName(category);
              return (
                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9f6f0', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '500' }}>{name}</span>
                  <button onClick={() => handleDeleteCategory(category)} style={{ padding: '4px 12px', background: '#8d261a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid rgba(36, 25, 19, 0.12)',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0, color: '#241913' }}>Subcategories</h2>
              <p style={{ margin: '4px 0 0', color: '#71635b', fontSize: '0.85rem' }}>Manage product subcategories</p>
            </div>
            <button onClick={() => setShowSubcategoryForm(true)} style={{ padding: '8px 16px', background: '#b85c38', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>+ Add Subcategory</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(subcategories || []).map((subcategory) => {
              const id = subcategory._id || subcategory.id || subcategory;
              const name = getSubcategoryName(subcategory);
              return (
                <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9f6f0', borderRadius: '8px', gap: '12px' }}>
                  <span style={{ fontWeight: '500' }}>
                    {name}
                    <small style={{ display: 'block', color: '#71635b', marginTop: '3px' }}>
                      {getSubcategoryCategoryName(subcategory)}
                    </small>
                  </span>
                  <button onClick={() => handleDeleteSubcategory(subcategory)} style={{ padding: '4px 12px', background: '#8d261a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Delete</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showCategoryForm && (
        <CategoryForm
          type="category"
          onAdd={handleAddCategory}
          onCancel={() => setShowCategoryForm(false)}
        />
      )}

      {showSubcategoryForm && (
        <CategoryForm
          type="subcategory"
          categories={categories || []}
          onAdd={handleAddSubcategory}
          onCancel={() => setShowSubcategoryForm(false)}
        />
      )}
    </div>
  );
}

export default CategoriesManagement;