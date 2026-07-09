import { useAdmin } from "../context/AdminContext";

function AdminDashboard() {
  const { products, orders, users } = useAdmin();
  const stats = {
    totalProducts: (products || []).length,
    totalOrders: (orders || []).length,
    totalUsers: (users || []).length,
    totalRevenue: (orders || []).reduce(
      (sum, order) => sum + (order.total || 0),
      0,
    ),
    pendingOrders: (orders || []).filter(
      (order) => order.status === "Processing",
    ).length,
    outOfStock: (products || []).filter((product) => product.stock === 0)
      .length,
    lowStock: (products || []).filter(
      (product) => product.stock > 0 && product.stock <= 5,
    ).length,
  };
  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "🛍️",
      color: "#b85c38",
      bg: "#fff0e8",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "📦",
      color: "#456b55",
      bg: "#e8f3ef",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "#d8a540",
      bg: "#fff8e7",
    },
    {
      title: "Total Revenue",
      value: `Rs. ${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: "💰",
      color: "#2f5140",
      bg: "#e0f0e8",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      color: "#e67e22",
      bg: "#fff0e8",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock,
      icon: "⚠️",
      color: "#e74c3c",
      bg: "#ffe8df",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStock,
      icon: "📉",
      color: "#f39c12",
      bg: "#fff8e7",
    },
    {
      title: "Total Items Sold",
      value: orders.reduce((sum, order) => sum + (order.itemCount || 0), 0),
      icon: "🎯",
      color: "#8e44ad",
      bg: "#f3e8ff",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return { bg: "#fff8e7", color: "#d8a540", dot: "#d8a540" };
      case "Shipped":
        return { bg: "#e8f3ef", color: "#456b55", dot: "#456b55" };
      case "Delivered":
        return { bg: "#e0f0e8", color: "#2f5140", dot: "#2f5140" };
      case "Cancelled":
        return { bg: "#ffe8df", color: "#8d261a", dot: "#8d261a" };
      default:
        return { bg: "#f5f0eb", color: "#71635b", dot: "#71635b" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const getMonthlyRevenue = () => {
    const monthlyData = {};
    (orders || []).forEach((order) => {
      const date = new Date(order.orderDate);
      if (!isNaN(date)) {
        const monthYear = date.toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        });
        monthlyData[monthYear] =
          (monthlyData[monthYear] || 0) + (order.total || 0);
      }
    });
    return Object.entries(monthlyData).slice(-6);
  };

  const monthlyRevenue = getMonthlyRevenue();
  const maxRevenue = Math.max(...monthlyRevenue.map(([, value]) => value), 0);

  const getTopProducts = () => {
    const productSales = {};
    (orders || []).forEach((order) => {
      (order.items || []).forEach((item) => {
        productSales[item.name] =
          (productSales[item.name] || 0) + (item.quantity || 0);
      });
    });
    return Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const topProducts = getTopProducts();

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ margin: 0, color: "#241913", fontSize: "28px" }}>
          Welcome to Admin Dashboard
        </h2>
        <p style={{ margin: "8px 0 0", color: "#71635b" }}>
          Here's what's happening with your store today.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {statCards.map((stat, index) => (
          <div
            key={index}
            style={{
              padding: "20px",
              background: "white",
              borderRadius: "16px",
              border: "1px solid rgba(36, 25, 19, 0.12)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                {stat.icon}
              </div>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: stat.color,
                }}
              >
                {stat.value}
              </span>
            </div>
            <h3
              style={{
                margin: 0,
                color: "#71635b",
                fontSize: "0.9rem",
                fontWeight: "normal",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {stat.title}
            </h3>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid rgba(36, 25, 19, 0.12)",
            padding: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 20px", color: "#241913" }}>
            Revenue Overview
          </h3>
          {monthlyRevenue.length === 0 ? (
            <p
              style={{ textAlign: "center", color: "#71635b", padding: "40px" }}
            >
              No revenue data available yet
            </p>
          ) : (
            <div>
              {monthlyRevenue.map(([month, revenue], index) => (
                <div key={index} style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span style={{ color: "#71635b" }}>{month}</span>
                    <span style={{ fontWeight: "bold", color: "#b85c38" }}>
                      Rs. {revenue.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#f0f0f0",
                      borderRadius: "10px",
                      overflow: "hidden",
                      height: "8px",
                    }}
                  >
                    <div
                      style={{
                        width:
                          maxRevenue > 0
                            ? `${(revenue / maxRevenue) * 100}%`
                            : "0%",
                        height: "100%",
                        background: "linear-gradient(90deg, #b85c38, #d8a540)",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            border: "1px solid rgba(36, 25, 19, 0.12)",
            padding: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 20px", color: "#241913" }}>
            Top Selling Products
          </h3>
          {topProducts.length === 0 ? (
            <p
              style={{ textAlign: "center", color: "#71635b", padding: "40px" }}
            >
              No sales data available yet
            </p>
          ) : (
            <div>
              {topProducts.map(([productName, quantity], index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    borderBottom:
                      index < topProducts.length - 1
                        ? "1px solid #f0f0f0"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "#f6eadb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#b85c38",
                      }}
                    >
                      {index + 1}
                    </span>
                    <span style={{ fontWeight: "500" }}>{productName}</span>
                  </div>
                  <div
                    style={{
                      padding: "4px 12px",
                      background: "#e8f3ef",
                      borderRadius: "20px",
                      color: "#456b55",
                      fontWeight: "bold",
                    }}
                  >
                    {quantity} sold
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid rgba(36, 25, 19, 0.12)",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h3 style={{ margin: 0, color: "#241913" }}>Recent Orders</h3>
            <p
              style={{
                margin: "4px 0 0",
                color: "#71635b",
                fontSize: "0.85rem",
              }}
            >
              Latest customer orders
            </p>
          </div>
        </div>
        {(orders || []).length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "60px", color: "#71635b" }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
            <p>No orders have been placed yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "2px solid #f0f0f0",
                    textAlign: "left",
                    background: "#faf7f2",
                  }}
                >
                  <th
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#71635b",
                    }}
                  >
                    Order ID
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#71635b",
                    }}
                  >
                    Customer
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#71635b",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#71635b",
                    }}
                  >
                    Items
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#71635b",
                      textAlign: "right",
                    }}
                  >
                    Total
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#71635b",
                      textAlign: "center",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {(orders || []).slice(0, 5).map((order) => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <tr
                      key={order.id || order._id}
                      style={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: "500",
                          color: "#b85c38",
                        }}
                      >
                        #{order.id || order._id}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {order.customer?.first_name} {order.customer?.last_name}
                      </td>
                      <td style={{ padding: "12px", color: "#71635b" }}>
                        {formatDate(order.orderDate)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        {order.itemCount || order.items?.length || 0} item
                        {order.itemCount !== 1 ? "s" : ""}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        Rs. {(order.total || 0).toLocaleString("en-IN")}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: statusStyle.dot,
                              marginRight: "6px",
                            }}
                          ></span>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {(orders || []).length > 0 && (
          <div
            style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ color: "#71635b", fontSize: "0.85rem" }}>
              Showing last {Math.min(5, (orders || []).length)} of{" "}
              {(orders || []).length} orders
            </div>
            <div>
              <span style={{ color: "#71635b", fontSize: "0.85rem" }}>
                Average Order Value:{" "}
              </span>
              <strong style={{ color: "#b85c38" }}>
                Rs.{" "}
                {(
                  (orders || []).reduce(
                    (sum, order) => sum + (order.total || 0),
                    0,
                  ) / (orders || []).length || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
