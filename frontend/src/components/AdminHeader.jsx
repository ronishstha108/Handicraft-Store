// frontend/src/components/AdminHeader.jsx
function AdminHeader({ onLogout, currentPage }) {
  const getPageTitle = () => {
    switch(currentPage) {
      case "dashboard": 
        return "Dashboard";
      case "products": 
        return "Products Management";
      case "orders": 
        return "Orders Management";
      case "users": 
        return "Users Management";
      case "categories": 
        return "Categories Management";
      default: 
        return "Admin Panel";
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header style={{
      background: "white",
      borderBottom: "1px solid rgba(36, 25, 19, 0.12)",
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>
        <h1 style={{ 
          margin: 0, 
          fontSize: "1.5rem", 
          color: "#241913" 
        }}>
          {getPageTitle()}
        </h1>
        <p style={{ 
          margin: "4px 0 0", 
          color: "#71635b", 
          fontSize: "0.85rem" 
        }}>
          Manage your store from here
        </p>
      </div>
      
      <button
        onClick={handleLogout}
        style={{
          padding: "8px 20px",
          border: "1px solid #b85c38",
          borderRadius: "999px",
          background: "white",
          color: "#b85c38",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#b85c38";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "white";
          e.target.style.color = "#b85c38";
        }}
      >
        Logout
      </button>
    </header>
  );
}

export default AdminHeader;