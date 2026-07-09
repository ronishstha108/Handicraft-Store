// frontend/src/pages/OrdersManagement.jsx
import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import OrderDetailsModal from '../components/OrderDetailsModal';

function OrdersManagement() {
  const { orders, updateOrderStatus, deleteOrder } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const statuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

  const getStatusColor = (status) => {
    switch(status) {
      case "Processing": return { bg: "#fff8e7", color: "#d8a540" };
      case "Shipped": return { bg: "#e8f3ef", color: "#456b55" };
      case "Delivered": return { bg: "#e0f0e8", color: "#2f5140" };
      case "Cancelled": return { bg: "#ffe8df", color: "#8d261a" };
      default: return { bg: "#f5f0eb", color: "#71635b" };
    }
  };

  const filteredOrders = (orders || []).filter(order => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = searchTerm === "" || 
      (order.id || order._id).toString().includes(searchTerm) ||
      order.customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (orderId, newStatus) => {
    if (window.confirm(`Change order #${orderId} status to "${newStatus}"?`)) {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const handleDelete = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order #${orderId}? This action cannot be undone.`)) {
      deleteOrder(orderId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h2 style={{ margin: 0, color: "#241913" }}>Orders Management</h2>
          <p style={{ margin: "4px 0 0", color: "#71635b" }}>View and manage customer orders</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <input type="text" placeholder="Search by order ID or customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: "8px", width: "250px" }} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px 16px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <option value="all">All Orders</option>
            {statuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "16px", border: "1px solid rgba(36, 25, 19, 0.12)", overflow: "auto" }}>
        {filteredOrders.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#71635b" }}>No orders found</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f6eadb" }}>
              <tr>
                <th style={{ padding: "16px", textAlign: "left" }}>Order ID</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Customer</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Date</th>
                <th style={{ padding: "16px", textAlign: "right" }}>Total</th>
                <th style={{ padding: "16px", textAlign: "center" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                const orderId = order.id || order._id;
                return (
                  <tr key={orderId} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "16px", fontWeight: "500" }}>#{orderId}</td>
                    <td style={{ padding: "16px" }}>{order.customer?.first_name} {order.customer?.last_name}<br /><span style={{ fontSize: "0.8rem", color: "#71635b" }}>{order.customer?.phone}</span></td>
                    <td style={{ padding: "16px" }}>{formatDate(order.orderDate)}</td>
                    <td style={{ padding: "16px", textAlign: "right", fontWeight: "bold" }}>Rs. {(order.total || 0).toLocaleString("en-IN")}</td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <select value={order.status} onChange={(e) => handleStatusChange(orderId, e.target.value)} style={{ padding: "6px 12px", borderRadius: "8px", border: `1px solid ${statusStyle.color}`, background: statusStyle.bg, color: statusStyle.color, fontWeight: "bold", cursor: "pointer" }}>
                        {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <button onClick={() => setSelectedOrder(order)} style={{ padding: "6px 12px", marginRight: "8px", background: "#456b55", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>View</button>
                      <button onClick={() => handleDelete(orderId)} style={{ padding: "6px 12px", background: "#8d261a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
}

export default OrdersManagement;