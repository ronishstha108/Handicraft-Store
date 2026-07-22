// frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import { ShoppingCartProvider, useShoppingCart } from "./context/ShoppingCartContext";
import LandingPage from "./pages/LandingPage";
import ShopPage from "./pages/ShopPage";
import OrderHistory from "./pages/OrderHistory";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import Auth from "./pages/Auth";
import CheckoutForm from "./components/CheckoutForm";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import "./App.css";

const CheckoutWrapper = () => {
  const cart = useShoppingCart();
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
          
          {/* Payment Routes */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="/payment-khalti-callback" element={<PaymentSuccess />} /> {/* Khalti callback */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/checkout" element={<CheckoutWrapper />} />
            <Route path="/orders" element={<OrderHistory />} />
          </Route>

          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ShoppingCartProvider>
    </AdminProvider>
  );
}

export default App;