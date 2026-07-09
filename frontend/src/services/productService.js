import apiClient from "../api/client";

// Fallback products if API fails
const fallbackProducts = [];

export const productService = {
  // Get all products with filters
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "All" && value !== "") {
          params.append(key, value);
        }
      });

      const response = await apiClient.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      // Return fallback data (empty array since we deleted productCatalog)
      return {
        data: fallbackProducts,
        pagination: { page: 1, totalPages: 1, total: fallbackProducts.length },
      };
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return { data: null };
    }
  },

  // Create product (admin)
  createProduct: async (productData) => {
    const response = await apiClient.post("/products", productData);
    return response.data;
  },

  // Update product (admin)
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin)
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  // Update stock (admin)
  updateStock: async (id, stock) => {
    const response = await apiClient.patch(`/products/${id}/stock`, { stock });
    return response.data;
  },
};
