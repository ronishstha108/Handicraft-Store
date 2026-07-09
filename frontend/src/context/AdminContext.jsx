// frontend/src/context/AdminContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { productService } from "../services/productService";
import { orderService } from "../services/orderService";
import { userService } from "../services/userService";
import { categoryService } from "../services/categoryService";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load all data
  const loadData = async () => {
    try {
      // Check if admin is logged in
      const token = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");
      
      // ✅ FIX: Skip loading if not admin - DON'T redirect
      if (!token || !adminToken) {
        console.log("ℹ️ No admin token found, skipping data load");
        setLoading(false);
        return; // Just return, don't redirect
      }

      setLoading(true);
      setError(null);
      
      console.log("🔄 Loading admin data...");
      
      // Try to load from cache first
      const cachedData = localStorage.getItem("adminCachedData");
      const cacheTimestamp = localStorage.getItem("adminCacheTimestamp");
      const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

      if (cachedData && cacheAge < CACHE_DURATION) {
        try {
          const parsed = JSON.parse(cachedData);
          console.log("📦 Using cached data from localStorage");
          setProducts(parsed.products || []);
          setOrders(parsed.orders || []);
          setUsers(parsed.users || []);
          setCategories(parsed.categories || []);
          setSubcategories(parsed.subcategories || []);
          setDataLoaded(true);
          setLoading(false);
          return;
        } catch (e) {
          console.log("⚠️ Cache parsing failed, fetching fresh data");
        }
      }

      // Load all data in parallel from API
      const [productsRes, ordersRes, usersRes, categoriesRes, subcategoriesRes] = await Promise.all([
        productService.getProducts(),
        orderService.getOrders(),
        userService.getUsers(),
        categoryService.getCategories(),
        categoryService.getSubcategories()
      ]);

      const newProducts = productsRes.data || [];
      const newOrders = ordersRes.data || [];
      const newUsers = usersRes.data || [];
      const newCategories = categoriesRes.data || [];
      const newSubcategories = subcategoriesRes.data || [];

      console.log("✅ Products loaded:", newProducts.length);
      console.log("✅ Orders loaded:", newOrders.length);
      console.log("✅ Users loaded:", newUsers.length);
      console.log("✅ Categories loaded:", newCategories.length);
      console.log("✅ Subcategories loaded:", newSubcategories.length);

      setProducts(newProducts);
      setOrders(newOrders);
      setUsers(newUsers);
      setCategories(newCategories);
      setSubcategories(newSubcategories);
      setDataLoaded(true);

      // Cache data in localStorage
      const cacheData = {
        products: newProducts,
        orders: newOrders,
        users: newUsers,
        categories: newCategories,
        subcategories: newSubcategories
      };
      localStorage.setItem("adminCachedData", JSON.stringify(cacheData));
      localStorage.setItem("adminCacheTimestamp", Date.now().toString());
      
    } catch (error) {
      console.error("❌ Error loading admin data:", error);
      setError(error.message || "Failed to load data");
      
      // Try to load from localStorage as fallback
      try {
        const savedProducts = localStorage.getItem("adminProducts");
        const savedOrders = localStorage.getItem("adminOrders");
        const savedUsers = localStorage.getItem("adminUsers");
        const savedCategories = localStorage.getItem("adminCategories");
        const savedSubcategories = localStorage.getItem("adminSubcategories");

        if (savedProducts) setProducts(JSON.parse(savedProducts));
        if (savedOrders) setOrders(JSON.parse(savedOrders));
        if (savedUsers) setUsers(JSON.parse(savedUsers));
        if (savedCategories) setCategories(JSON.parse(savedCategories));
        if (savedSubcategories) setSubcategories(JSON.parse(savedSubcategories));
        setDataLoaded(true);
      } catch (e) {
        console.error("Error loading from localStorage:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Load data on mount - ONLY if admin is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    
    if (token && adminToken) {
      // Load from cache immediately
      const cachedData = localStorage.getItem("adminCachedData");
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          setProducts(parsed.products || []);
          setOrders(parsed.orders || []);
          setUsers(parsed.users || []);
          setCategories(parsed.categories || []);
          setSubcategories(parsed.subcategories || []);
          setDataLoaded(true);
          console.log("📦 Loaded cached data on mount");
        } catch (e) {
          console.log("⚠️ Cache parsing failed on mount");
        }
      }
      // Load fresh data in background
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  // Update cache helper
  const updateCache = (updates) => {
    try {
      const cachedData = localStorage.getItem("adminCachedData");
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const updated = { ...parsed, ...updates };
        localStorage.setItem("adminCachedData", JSON.stringify(updated));
        localStorage.setItem("adminCacheTimestamp", Date.now().toString());
      }
    } catch (e) {
      console.error("Error updating cache:", e);
    }
  };

  // Product CRUD
  const addProduct = async (productData) => {
    try {
      const response = await productService.createProduct(productData);
      const newProduct = response.data;
      const newProducts = [...products, newProduct];
      setProducts(newProducts);
      updateCache({ products: newProducts });
      return newProduct;
    } catch (error) {
      console.error("Add product error:", error);
      const tempProduct = { ...productData, _id: Date.now().toString() };
      const newProducts = [...products, tempProduct];
      setProducts(newProducts);
      return tempProduct;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await productService.updateProduct(id, productData);
      const updatedProduct = response.data;
      const newProducts = products.map(p => (p._id === id || p.id === id) ? updatedProduct : p);
      setProducts(newProducts);
      updateCache({ products: newProducts });
      return updatedProduct;
    } catch (error) {
      console.error("Update product error:", error);
      const newProducts = products.map(p => (p._id === id || p.id === id) ? { ...p, ...productData } : p);
      setProducts(newProducts);
      return { ...productData, _id: id };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      const newProducts = products.filter(p => p._id !== id && p.id !== id);
      setProducts(newProducts);
      updateCache({ products: newProducts });
      return true;
    } catch (error) {
      console.error("Delete product error:", error);
      const newProducts = products.filter(p => p._id !== id && p.id !== id);
      setProducts(newProducts);
      return true;
    }
  };

  // Order CRUD
  const addOrder = async (orderData) => {
    try {
      const response = await orderService.createOrder(orderData);
      const newOrder = response.data;
      const newOrders = [newOrder, ...orders];
      setOrders(newOrders);
      updateCache({ orders: newOrders });
      return newOrder;
    } catch (error) {
      console.error("Add order error:", error);
      const tempOrder = { ...orderData, _id: Date.now().toString() };
      const newOrders = [tempOrder, ...orders];
      setOrders(newOrders);
      return tempOrder;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await orderService.updateOrderStatus(id, status);
      const updatedOrder = response.data;
      const newOrders = orders.map(o => (o._id === id || o.id === id) ? updatedOrder : o);
      setOrders(newOrders);
      updateCache({ orders: newOrders });
      return updatedOrder;
    } catch (error) {
      console.error("Update order status error:", error);
      const newOrders = orders.map(o => (o._id === id || o.id === id) ? { ...o, status } : o);
      setOrders(newOrders);
      return { _id: id, status };
    }
  };

  const deleteOrder = async (id) => {
    try {
      await orderService.deleteOrder(id);
      const newOrders = orders.filter(o => o._id !== id && o.id !== id);
      setOrders(newOrders);
      updateCache({ orders: newOrders });
      return true;
    } catch (error) {
      console.error("Delete order error:", error);
      const newOrders = orders.filter(o => o._id !== id && o.id !== id);
      setOrders(newOrders);
      return true;
    }
  };

  // User CRUD
  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      const newUsers = users.filter(u => u._id !== id && u.id !== id);
      setUsers(newUsers);
      updateCache({ users: newUsers });
      return true;
    } catch (error) {
      console.error("Delete user error:", error);
      const newUsers = users.filter(u => u._id !== id && u.id !== id);
      setUsers(newUsers);
      return true;
    }
  };

  // Category CRUD
  const addCategory = async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      const newCategory = response.data;
      const newCategories = [...categories, newCategory];
      setCategories(newCategories);
      updateCache({ categories: newCategories });
      return newCategory;
    } catch (error) {
      console.error("Add category error:", error);
      const tempCategory = typeof categoryData === 'string' 
        ? { name: categoryData, _id: Date.now().toString() }
        : { ...categoryData, _id: Date.now().toString() };
      const newCategories = [...categories, tempCategory];
      setCategories(newCategories);
      return tempCategory;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryService.deleteCategory(id);
      const newCategories = categories.filter(c => c._id !== id && c.id !== id);
      setCategories(newCategories);
      updateCache({ categories: newCategories });
      return true;
    } catch (error) {
      console.error("Delete category error:", error);
      const newCategories = categories.filter(c => c._id !== id && c.id !== id);
      setCategories(newCategories);
      return true;
    }
  };

  const addSubcategory = async (subcategoryData) => {
    try {
      const response = await categoryService.createSubcategory(subcategoryData);
      const newSubcategory = response.data;
      const newSubcategories = [...subcategories, newSubcategory];
      setSubcategories(newSubcategories);
      updateCache({ subcategories: newSubcategories });
      return newSubcategory;
    } catch (error) {
      console.error("Add subcategory error:", error);
      const tempSubcategory = { 
        ...subcategoryData, 
        _id: Date.now().toString(),
        category: typeof subcategoryData.category === 'string' 
          ? categories.find(c => c._id === subcategoryData.category || c.id === subcategoryData.category)
          : subcategoryData.category
      };
      const newSubcategories = [...subcategories, tempSubcategory];
      setSubcategories(newSubcategories);
      return tempSubcategory;
    }
  };

  const deleteSubcategory = async (id) => {
    try {
      await categoryService.deleteSubcategory(id);
      const newSubcategories = subcategories.filter(s => s._id !== id && s.id !== id);
      setSubcategories(newSubcategories);
      updateCache({ subcategories: newSubcategories });
      return true;
    } catch (error) {
      console.error("Delete subcategory error:", error);
      const newSubcategories = subcategories.filter(s => s._id !== id && s.id !== id);
      setSubcategories(newSubcategories);
      return true;
    }
  };

  const value = {
    products,
    orders,
    users,
    categories,
    subcategories,
    loading,
    error,
    dataLoaded,
    loadData,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    deleteUser,
    addCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};