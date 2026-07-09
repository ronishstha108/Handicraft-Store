// frontend/src/pages/UsersManagement.jsx
import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function UsersManagement() {
  const { users, deleteUser } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  const userList = users || [];

  const filteredUsers = userList.filter(user =>
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      deleteUser(userId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return "N/A";
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ margin: 0, color: "#241913" }}>Users Management</h2>
          <p style={{ margin: "4px 0 0", color: "#71635b" }}>Manage registered customers</p>
        </div>
        <div>
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: "8px", width: "250px" }} 
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
        {filteredUsers.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", padding: "60px", textAlign: "center", background: "white", borderRadius: "16px", color: "#71635b" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>👤</div>
            <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>No users found</p>
            <p style={{ fontSize: "14px", color: "#999" }}>Users will appear here when they register.</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const userId = user._id || user.id;
            return (
              <div key={userId} style={{ background: "white", borderRadius: "16px", border: "1px solid rgba(36, 25, 19, 0.12)", padding: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ 
                    width: "60px", 
                    height: "60px", 
                    borderRadius: "50%", 
                    background: "#f6eadb", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: "24px", 
                    fontWeight: "bold", 
                    color: "#b85c38", 
                    marginRight: "16px" 
                  }}>
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: "#241913" }}>{user.first_name} {user.last_name}</h3>
                    <p style={{ margin: "4px 0 0", color: "#71635b", fontSize: "0.85rem" }}>Joined: {formatDate(user.joinDate || user.createdAt)}</p>
                  </div>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ margin: "8px 0", fontSize: "0.9rem" }}><strong>Email:</strong> {user.email}</p>
                  <p style={{ margin: "8px 0", fontSize: "0.9rem" }}><strong>Phone:</strong> {user.phone || "Not provided"}</p>
                  <p style={{ margin: "8px 0", fontSize: "0.9rem" }}><strong>Total Orders:</strong> {user.totalOrders || 0}</p>
                  <p style={{ margin: "8px 0", fontSize: "0.9rem" }}><strong>Total Spent:</strong> Rs. {(user.totalSpent || 0).toLocaleString("en-IN")}</p>
                </div>
                <button 
                  onClick={() => handleDelete(userId, `${user.first_name} ${user.last_name}`)} 
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    background: "#8d261a", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    fontWeight: "bold", 
                    cursor: "pointer" 
                  }}
                >
                  Delete User
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default UsersManagement;