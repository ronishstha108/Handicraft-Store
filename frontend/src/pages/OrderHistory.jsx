// frontend/src/pages/OrderHistory.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../services/orderService";

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      if (response && response.data) {
        setOrders(response.data);
        localStorage.setItem("orderHistory", JSON.stringify(response.data));
      } else {
        const savedOrders = localStorage.getItem("orderHistory");
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      const savedOrders = localStorage.getItem("orderHistory");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const handleShop = () => {
    navigate("/shop");
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone."
    );

    if (!confirmCancel) return;

    try {
      setLoading(true);
      const response = await orderService.cancelOrder(orderId);
      if (response.success) {
        alert("✅ Order cancelled successfully!");
        await loadOrders();
      }
    } catch (error) {
      alert(`❌ Failed to cancel order: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Processing":
        return { color: "#d8a540", bg: "#fff8e7" };
      case "Shipped":
        return { color: "#456b55", bg: "#e8f3ef" };
      case "Delivered":
        return { color: "#2f5140", bg: "#e0f0e8" };
      case "Cancelled":
        return { color: "#8d261a", bg: "#ffe8df" };
      default:
        return { color: "#71635b", bg: "#f5f0eb" };
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Processing": return "⚙️";
      case "Shipped": return "📦";
      case "Delivered": return "✅";
      case "Cancelled": return "❌";
      default: return "📋";
    }
  };

  const canCancel = (order) => {
    return order.status === "Processing" || order.status === "Shipped";
  };

  // Custom Header without navigation links
  const CustomHeader = () => (
    <header style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px 24px",
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(18px)",
      borderBottom: "1px solid rgba(36, 25, 19, 0.12)",
      position: "sticky",
      top: 0,
      zIndex: 10
    }}>
      <button 
        onClick={handleHome}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          border: 0,
          background: "transparent",
          color: "#241913",
          fontSize: "1.05rem",
          fontWeight: 800,
          cursor: "pointer"
        }}
      >
        <span style={{
          display: "grid",
          width: "38px",
          height: "38px",
          placeItems: "center",
          borderRadius: "50%",
          color: "white",
          background: "#b85c38",
          boxShadow: "0 10px 24px rgba(184, 92, 56, 0.3)"
        }}>
          H
        </span>
        Handicraft Store
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button 
          onClick={handleShop}
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
          Continue Shopping
        </button>
        <button 
          onClick={handleLogout}
          style={{
            padding: "8px 20px",
            border: "1px solid #ddd",
            borderRadius: "999px",
            background: "transparent",
            color: "#71635b",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#ffe8df";
            e.target.style.borderColor = "#8d261a";
            e.target.style.color = "#8d261a";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.borderColor = "#ddd";
            e.target.style.color = "#71635b";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "#fffaf2" }}>
        <CustomHeader />
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
          <p>Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main style={{ minHeight: "100vh", background: "#fffaf2" }}>
        <CustomHeader />
        
        <div style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "34px 20px 80px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "22px",
            marginBottom: "28px"
          }}>
            <h1 style={{
              margin: 0,
              color: "#241913",
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2.6rem, 5vw, 4.8rem)",
              lineHeight: "0.98",
              letterSpacing: 0
            }}>
              My Orders
            </h1>
          </div>
          
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            border: "1px dashed rgba(184, 92, 56, 0.35)",
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.58)"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>📦</div>
            <h2 style={{ color: "#241913", marginBottom: "10px" }}>No orders yet</h2>
            <p style={{ color: "#71635b", marginBottom: "30px" }}>
              You haven't placed any orders. Start shopping to see your orders here!
            </p>
            <button 
              onClick={handleShop} 
              style={{
                padding: "12px 32px",
                border: "none",
                borderRadius: "999px",
                background: "#b85c38",
                color: "white",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(184, 92, 56, 0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 12px 32px rgba(184, 92, 56, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 24px rgba(184, 92, 56, 0.3)";
              }}
            >
              Start Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fffaf2" }}>
      <CustomHeader />
      
      <div style={{
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "34px 20px 80px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "22px",
          marginBottom: "28px"
        }}>
          <h1 style={{
            margin: 0,
            color: "#241913",
            fontFamily: "Georgia, serif",
            fontSize: "clamp(2.6rem, 5vw, 4.8rem)",
            lineHeight: "0.98",
            letterSpacing: 0
          }}>
            My Orders
          </h1>
          <button 
            onClick={handleShop} 
            style={{
              padding: "10px 24px",
              border: "1px solid #ddd",
              borderRadius: "999px",
              background: "white",
              color: "#71635b",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f6eadb";
              e.target.style.borderColor = "#b85c38";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
              e.target.style.borderColor = "#ddd";
            }}
          >
            ← Continue Shopping
          </button>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          {orders.map((order) => {
            const statusStyle = getStatusColor(order.status);
            const canCancelOrder = canCancel(order);
            return (
              <div key={order._id || order.id} style={{
                border: "1px solid rgba(36, 25, 19, 0.12)",
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.76)",
                overflow: "hidden"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 24px",
                  borderBottom: "1px solid rgba(36, 25, 19, 0.12)",
                  background: "rgba(255, 255, 255, 0.5)",
                  flexWrap: "wrap",
                  gap: "12px"
                }}>
                  <div>
                    <p style={{ margin: 0, color: "#71635b", fontSize: "0.85rem" }}>
                      Order #{order.orderId || order.id || order._id}
                    </p>
                    <p style={{ margin: "5px 0 0", fontWeight: "bold", color: "#241913" }}>
                      {formatDate(order.orderDate || order.createdAt)}
                    </p>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background: statusStyle.bg
                  }}>
                    <span>{getStatusIcon(order.status)}</span>
                    <span style={{ color: statusStyle.color, fontWeight: "bold" }}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div style={{ fontWeight: "bold", color: "#b85c38" }}>
                    Total: Rs. {order.total?.toLocaleString("en-IN") || 0}
                  </div>
                </div>

                <div style={{ padding: "20px 24px" }}>
                  <p style={{ margin: "0 0 12px", fontWeight: "bold", color: "#241913" }}>
                    Items ({order.itemCount})
                  </p>
                  
                  <div style={{ display: "grid", gap: "12px" }}>
                    {order.items?.map((item) => (
                      <div key={item._id || item.id || item.product} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "12px",
                        borderBottom: "1px solid rgba(36, 25, 19, 0.08)"
                      }}>
                        <img 
                          src={item.img} 
                          alt={item.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "12px",
                            objectFit: "cover"
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, fontSize: "1rem", color: "#241913" }}>
                            {item.name}
                          </h4>
                          <p style={{ margin: "4px 0 0", color: "#71635b", fontSize: "0.85rem" }}>
                            Qty: {item.quantity} × Rs. {item.price?.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div style={{ fontWeight: "bold", color: "#241913" }}>
                          Rs. {(item.price * item.quantity)?.toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  padding: "12px 24px",
                  background: "rgba(246, 234, 219, 0.4)",
                  borderTop: "1px solid rgba(36, 25, 19, 0.12)",
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap"
                }}>
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === (order._id || order.id) ? null : (order._id || order.id))}
                    style={{
                      padding: "8px 16px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      background: "white",
                      color: "#71635b",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#f6eadb";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "white";
                    }}
                  >
                    {selectedOrder === (order._id || order.id) ? "▼ Hide Details" : "▶ View Details"}
                  </button>

                  {canCancelOrder && (
                    <button
                      onClick={() => handleCancelOrder(order._id || order.id)}
                      style={{
                        padding: "8px 16px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#8d261a",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                      disabled={loading}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#6b1e14";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#8d261a";
                      }}
                    >
                      ❌ Cancel Order
                    </button>
                  )}

                  {order.status === "Cancelled" && (
                    <span style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "#ffe8df",
                      color: "#8d261a",
                      fontWeight: "bold"
                    }}>
                      Order Cancelled
                    </span>
                  )}
                </div>

                {selectedOrder === (order._id || order.id) && (
                  <div style={{
                    padding: "20px 24px",
                    background: "white",
                    borderTop: "1px solid rgba(36, 25, 19, 0.12)"
                  }}>
                    <h4 style={{ margin: "0 0 12px", color: "#241913" }}>Order Timeline</h4>
                    <div style={{ position: "relative", paddingLeft: "20px" }}>
                      <div style={{
                        position: "absolute",
                        left: "8px",
                        top: "0",
                        bottom: "0",
                        width: "2px",
                        background: "#e0d6cc"
                      }}></div>
                      
                      <div style={{ marginBottom: "20px", position: "relative" }}>
                        <div style={{
                          position: "absolute",
                          left: "-24px",
                          top: "0",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: order.status === "Cancelled" ? "#8d261a" : "#d8a540"
                        }}></div>
                        <p style={{ margin: 0, fontWeight: "bold" }}>Order Placed</p>
                        <p style={{ margin: "4px 0 0", color: "#71635b", fontSize: "0.85rem" }}>
                          {formatDate(order.orderDate || order.createdAt)}
                        </p>
                      </div>
                      
                      {order.status !== "Processing" && order.status !== "Cancelled" && (
                        <div style={{ marginBottom: "20px", position: "relative" }}>
                          <div style={{
                            position: "absolute",
                            left: "-24px",
                            top: "0",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: order.status === "Shipped" ? "#d8a540" : "#456b55"
                          }}></div>
                          <p style={{ margin: 0, fontWeight: "bold" }}>Order Shipped</p>
                          <p style={{ margin: "4px 0 0", color: "#71635b", fontSize: "0.85rem" }}>
                            Estimated: Within 3-5 business days
                          </p>
                        </div>
                      )}
                      
                      {order.status === "Delivered" && (
                        <div style={{ position: "relative" }}>
                          <div style={{
                            position: "absolute",
                            left: "-24px",
                            top: "0",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: "#2f5140"
                          }}></div>
                          <p style={{ margin: 0, fontWeight: "bold" }}>Delivered</p>
                          <p style={{ margin: "4px 0 0", color: "#71635b", fontSize: "0.85rem" }}>
                            Your order has been delivered!
                          </p>
                        </div>
                      )}

                      {order.status === "Cancelled" && (
                        <div style={{ position: "relative" }}>
                          <div style={{
                            position: "absolute",
                            left: "-24px",
                            top: "0",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: "#8d261a"
                          }}></div>
                          <p style={{ margin: 0, fontWeight: "bold", color: "#8d261a" }}>Order Cancelled</p>
                          <p style={{ margin: "4px 0 0", color: "#71635b", fontSize: "0.85rem" }}>
                            {order.cancelledAt ? formatDate(order.cancelledAt) : "Order was cancelled"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default OrderHistory;