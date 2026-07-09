// frontend/src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  
  // Check if admin is logged in
  if (!adminToken || !token || !user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Verify user role
  try {
    const userData = JSON.parse(user);
    if (userData.role !== "admin") {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default AdminRoute;