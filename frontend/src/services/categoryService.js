import apiClient from '../api/client';

export const categoryService = {
  getCategories: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      const fallbackCategories = ['Basketry', 'Ceramics', 'Textiles', 'Woodcraft', 'Wall Decor', 'Tableware'];
      return { data: fallbackCategories.map((name) => ({ _id: name, name })) };
    }
  },

  createCategory: async (category) => {
    const payload =
      typeof category === 'string'
        ? { name: category }
        : {
            name: category.name,
            description: category.description,
            icon: category.icon,
          };

    const response = await apiClient.post('/categories', payload);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },

  getSubcategories: async () => {
    try {
      const response = await apiClient.get('/categories/subcategories');
      return response.data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      const fallbackSubcategories = ['Storage Baskets', 'Decor Vases', 'Macrame Art', 'Mugs', 'Scarves', 'Serving Bowls'];
      return { data: fallbackSubcategories.map((name) => ({ _id: name, name })) };
    }
  },

  createSubcategory: async (subcategory) => {
    const payload =
      typeof subcategory === 'string'
        ? { name: subcategory }
        : {
            name: subcategory.name,
            category: subcategory.category,
            description: subcategory.description,
          };

    const response = await apiClient.post('/categories/subcategories', payload);
    return response.data;
  },

  deleteSubcategory: async (id) => {
    const response = await apiClient.delete(`/categories/subcategories/${id}`);
    return response.data;
  },
};
