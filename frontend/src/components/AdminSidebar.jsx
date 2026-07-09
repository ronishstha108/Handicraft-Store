// frontend/src/components/AdminSidebar.jsx
function AdminSidebar({ currentPage, onNavigate }) {
  const menuItems = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "products", label: "🛍️ Products" },
    { id: "orders", label: "📦 Orders" },
    { id: "users", label: "👥 Users" },
    { id: "categories", label: "🏷️ Categories" }
  ];

  return (
    <aside style={{
      width: "260px",
      background: "white",
      borderRight: "1px solid rgba(36, 25, 19, 0.12)",
      minHeight: "100vh",
      padding: "24px 0",
      position: "sticky",
      top: 0,
      height: "100vh",
      overflow: "auto"
    }}>
      {/* Brand */}
      <div style={{
        padding: "0 24px 20px",
        borderBottom: "1px solid rgba(36, 25, 19, 0.12)",
        marginBottom: "16px"
      }}>
        <h2 style={{ 
          margin: 0, 
          color: "#b85c38",
          fontSize: "1.2rem"
        }}>
          🏺 Admin Panel
        </h2>
      </div>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              width: "100%",
              padding: "12px 24px",
              textAlign: "left",
              border: "none",
              background: currentPage === item.id ? "#f6eadb" : "transparent",
              color: currentPage === item.id ? "#b85c38" : "#71635b",
              fontWeight: currentPage === item.id ? "bold" : "normal",
              cursor: "pointer",
              fontSize: "1rem",
              borderLeft: currentPage === item.id ? "3px solid #b85c38" : "3px solid transparent",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (currentPage !== item.id) {
                e.target.style.background = "#f9f6f0";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== item.id) {
                e.target.style.background = "transparent";
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;