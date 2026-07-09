// frontend/src/hooks/useAdminAuth.js
import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const useAdminAuth = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const apiToken = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // Check if admin is logged in
    if (adminToken === 'admin_authenticated' && apiToken && user) {
      try {
        const userData = JSON.parse(user);
        if (userData.role === 'admin') {
          setIsAdminLoggedIn(true);
        }
      } catch (e) {
        setIsAdminLoggedIn(false);
      }
    }
    setAdminLoading(false);
  }, []);

  const adminLogin = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const user = response?.user;

      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
        };
      }

      if (user.role !== 'admin') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return {
          success: false,
          message: 'This account is not an admin account',
        };
      }

      localStorage.setItem('adminToken', 'admin_authenticated');
      setIsAdminLoggedIn(true);
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Admin login failed',
      };
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAdminLoggedIn(false);
  };

  return {
    isAdminLoggedIn,
    adminLoading,
    adminLogin,
    adminLogout,
  };
};