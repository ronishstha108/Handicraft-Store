// frontend/src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Fix: Use 'token' instead of 'userToken'
  const isLoggedIn = localStorage.getItem("token") !== null;
  
  // Also check if token exists and is valid
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  
  const isValid = token !== null && user !== null;
  
  return isValid ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;