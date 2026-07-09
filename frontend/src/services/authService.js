// frontend/src/services/authService.js
import apiClient from "../api/client";

export const authService = {
  // Register user
  register: async (userData) => {
    try {
      console.log("📡 Registering user:", userData.email);
      const response = await apiClient.post("/auth/register", userData);
      console.log("📡 Register response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("✅ Token stored in localStorage");
        console.log("👤 User stored:", response.data.user);
      } else {
        console.error("❌ No token in response");
        throw new Error("Registration failed: No token received");
      }
      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Login user - MODIFIED: Returns response without auto-storing
  login: async (email, password) => {
    try {
      console.log("🔑 Calling login API with:", { email, password: "***" });

      const response = await apiClient.post("/auth/login", { email, password });
      console.log("📡 Login API response:", response.data);

      // Just return the response, don't auto-store
      return response.data;
    } catch (error) {
      console.error("❌ Login API error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Store auth data after successful login verification
  storeAuthData: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    console.log("✅ Auth data stored in localStorage");
    console.log("👤 User stored:", user);
  },

  // Get current user
  getMe: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    console.log("👋 Logged out");
  },

  // Check if authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    console.log("🔍 isAuthenticated:", !!token);
    return !!token;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};