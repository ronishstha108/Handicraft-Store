function OrderDetailsModal({ order, onClose }) {
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

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        borderRadius: "24px",
        width: "90%",
        maxWidth: "700px",
        maxHeight: "90vh",
        overflow: "auto",
        padding: "24px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#241913" }}>Order Details #{order.id || order.orderId}</h2>
          <button onClick={onClose} style={{ fontSize: "24px", border: "none", background: "none", cursor: "pointer" }}>×</button>
        </div>

        <div style={{ marginBottom: "20px", padding: "16px", background: "#f9f6f0", borderRadius: "12px" }}>
          <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3>Customer Information</h3>
          <div style={{ padding: "12px", background: "#f9f6f0", borderRadius: "12px" }}>
            <p><strong>Name:</strong> {order.customer?.first_name} {order.customer?.last_name}</p>
            <p><strong>Email:</strong> {order.customer?.email}</p>
            <p><strong>Phone:</strong> {order.customer?.phone}</p>
            <p><strong>Address:</strong> {order.customer?.address}{order.customer?.city ? `, ${order.customer.city}` : ""}</p>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3>Order Items</h3>
          <div style={{ border: "1px solid #ddd", borderRadius: "12px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f6eadb" }}>
                <tr>
                  <th style={{ padding: "10px", textAlign: "left" }}>Product</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Quantity</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Price</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index} style={{ borderTop: "1px solid #ddd" }}>
                    <td style={{ padding: "10px" }}>{item.name}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ padding: "10px", textAlign: "right" }}>Rs. {item.price.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "10px", textAlign: "right" }}>Rs. {(item.price * item.quantity).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot style={{ background: "#f9f6f0", borderTop: "2px solid #ddd" }}>
                <tr>
                  <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Subtotal:</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>Rs. {order.subtotal.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>Delivery Charge:</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>Rs. {order.deliveryCharge.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ padding: "10px", textAlign: "right", fontWeight: "bold", fontSize: "1.1rem" }}>Total:</td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: "bold", color: "#b85c38" }}>
                    Rs. {order.total.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;