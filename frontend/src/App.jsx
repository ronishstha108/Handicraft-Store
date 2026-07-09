// frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import { ShoppingCartProvider, useShoppingCart } from "./context/ShoppingCartContext";
import LandingPage from "./pages/LandingPage";
import ShopPage from "./pages/ShopPage";
import OrderHistory from "./pages/OrderHistory";
import AdminPanel from "./pages/AdminPanel"; // IMPORT THIS
import AdminLogin from "./components/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import Auth from "./pages/Auth";
import CheckoutForm from "./components/CheckoutForm";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

// Wrapper for CheckoutForm to provide cart
const CheckoutWrapper = () => {
  const cart = useShoppingCart();
  console.log("🛒 CheckoutWrapper cart:", cart);
  return <CheckoutForm cart={cart} />;
};

function App() {
  return (
    <AdminProvider>
      <ShoppingCartProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Routes - Require Login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/checkout" element={<CheckoutWrapper />} />
            <Route path="/orders" element={<OrderHistory />} />
          </Route>

          {/* Admin Routes - Protected with Admin check */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminPanel /> {/* USE AdminPanel HERE */}
              </AdminRoute>
            } 
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ShoppingCartProvider>
    </AdminProvider>
  );
}

export default App;