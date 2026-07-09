import axios from 'axios';

// Base URL for API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔑 Interceptor - Token:', token ? 'exists' : 'null');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.message);
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized - Clearing token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    // Return error message
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject({ ...error, message });
  }
);

export default apiClient;