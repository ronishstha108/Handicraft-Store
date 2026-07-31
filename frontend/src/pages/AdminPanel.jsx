// frontend/src/pages/AdminPanel.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AdminDashboard from "./AdminDashboard";
import ProductsManagement from "./ProductsManagement";
import OrdersManagement from "./OrdersManagement";
import UsersManagement from "./UsersManagement";
import CategoriesManagement from "./CategoriesManagement";

function AdminPanel() {
  const navigate = useNavigate();
  const { loading, error, dataLoaded, loadData, products, orders, users, categories, subcategories } = useAdmin();
  const [currentPage, setCurrentPage] = useState("dashboard");
  console.log("COnsole Test")
  // Load data only if not loaded yet
  useEffect(() => {
    if (!dataLoaded) {
      console.log("🔄 Data not loaded, fetching...");
      loadData();
    } else {
      console.log("📦 Data already loaded, using cache");
    }
  }, [dataLoaded, loadData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const handleNavigate = (page) => {
    console.log("📊 Navigating to:", page);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <AdminDashboard />;
      case "products":
        return <ProductsManagement />;
      case "orders":
        return <OrdersManagement />;
      case "users":
        return <UsersManagement />;
      case "categories":
        return <CategoriesManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  if (loading && !dataLoaded) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#fffaf2"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid #f6eadb",
            borderTop: "3px solid #b85c38",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px"
          }}></div>
          <p style={{ color: "#71635b" }}>Loading admin panel...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error && !dataLoaded) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#fffaf2",
        padding: "20px"
      }}>
        <div style={{
          textAlign: "center",
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <h2 style={{ color: "#8d261a", marginBottom: "8px" }}>Error Loading Data</h2>
          <p style={{ color: "#71635b" }}>{error}</p>
          <button
            onClick={() => loadData()}
            style={{
              marginTop: "20px",
              padding: "10px 24px",
              background: "#b85c38",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#faf7f2"
    }}>
      <AdminSidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
      />
      
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }}>
        <AdminHeader 
          currentPage={currentPage} 
          onLogout={handleLogout} 
        />
        
        <main style={{
          flex: 1,
          padding: "24px",
          overflow: "auto"
        }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;