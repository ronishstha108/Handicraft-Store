// frontend/src/components/CheckoutForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../services/orderService";

function CheckoutForm({ cart }) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEsewaModal, setShowEsewaModal] = useState(false);
  
  console.log("🛒 CheckoutForm received cart:", cart);
  console.log("🛒 Cart items:", cart?.items);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    esewa_number: "",
    esewa_password: "",
  });

  const [errors, setErrors] = useState({});

  // Navigation handlers
  const handleBackToShop = () => {
    navigate("/shop");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.esewa_number.trim()) {
      newErrors.esewa_number = "eSewa number is required";
    } else if (!/^[0-9]{10}$/.test(formData.esewa_number)) {
      newErrors.esewa_number = "Please enter a valid 10-digit eSewa number";
    }

    if (!formData.esewa_password.trim()) {
      newErrors.esewa_password = "eSewa password is required";
    } else if (formData.esewa_password.length < 4) {
      newErrors.esewa_password = "Password must be at least 4 characters";
    }

    return newErrors;
  };

  const calculateSubtotal = () => {
    const items = cart?.items || [];
    return items.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0,
    );
  };

  const calculateDeliveryCharge = () => {
    return 150;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryCharge();
  };

  const handleEsewaPayment = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setShowEsewaModal(true);
  };

  const processPayment = async () => {
    setIsProcessing(true);

    try {
      // Get user info from localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");
      
      console.log("👤 User data:", userData);
      console.log("🔑 Token exists:", !!token);

      // Prepare order data for MongoDB
      const orderData = {
        customer: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
        },
        items: cart.items.map((item) => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          img: item.img,
        })),
        subtotal: calculateSubtotal(),
        deliveryCharge: calculateDeliveryCharge(),
        total: calculateTotal(),
        paymentMethod: "eSewa",
        esewa_number: formData.esewa_number,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        orderDate: new Date().toISOString(),
        status: "Processing",
        user: userData.id, // Add user ID for MongoDB association
      };

      console.log("📦 Sending order to API:", orderData);

      // Call the API to save to MongoDB
      const response = await orderService.createOrder(orderData);
      console.log("📡 Order API response:", response);

      // Save to localStorage as backup
      const existingOrders = localStorage.getItem("orderHistory");
      let orders = [];
      if (existingOrders) {
        orders = JSON.parse(existingOrders);
      }
      
      const newOrder = response.data || response;
      orders.unshift(newOrder);
      localStorage.setItem("orderHistory", JSON.stringify(orders));

      alert(
        `✅ Order Placed Successfully!\n\nOrder ID: #${newOrder.orderId || newOrder._id || newOrder.id}\nTotal: Rs. ${(newOrder.total || calculateTotal()).toLocaleString("en-IN")}`,
      );

      cart.clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("❌ Order error:", error);
      alert(`❌ Order failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsProcessing(false);
      setShowEsewaModal(false);
    }
  };

  const cartItems = cart?.items || [];

  if (cartItems.length === 0) {
    return (
      <div className="checkout-section">
        <div className="checkout-heading">
          <h1>Checkout</h1>
          <button onClick={handleBackToShop} className="secondary-button">
            ← Continue Shopping
          </button>
        </div>
        <div className="empty-cart" style={{
          textAlign: "center",
          padding: "60px 20px",
          border: "1px dashed rgba(184, 92, 56, 0.35)",
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.58)"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🛒</div>
          <h2 style={{ color: "#241913", marginBottom: "10px" }}>Your cart is empty</h2>
          <p style={{ color: "#71635b", marginBottom: "30px" }}>
            Add items to your cart before proceeding to checkout.
          </p>
          <button onClick={handleBackToShop} className="primary-button">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-section">
      <div className="checkout-heading">
        <h1>Checkout</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={handleBackToShop} className="secondary-button">
            ← Continue Shopping
          </button>
        </div>
      </div>

      <div className="checkout-layout">
        <div className="checkout-forms">
          <form onSubmit={(e) => e.preventDefault()}>
            <fieldset className="checkout-card">
              <legend>Shipping Information</legend>

              <div className="form-grid">
                <div className={errors.first_name ? "error" : ""}>
                  <label>
                    First Name *
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </label>
                  {errors.first_name && (
                    <span className="error-text">{errors.first_name}</span>
                  )}
                </div>

                <div className={errors.last_name ? "error" : ""}>
                  <label>
                    Last Name *
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </label>
                  {errors.last_name && (
                    <span className="error-text">{errors.last_name}</span>
                  )}
                </div>

                <div className={errors.email ? "error" : ""}>
                  <label>
                    Email Address *
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </label>
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>

                <div className={errors.phone ? "error" : ""}>
                  <label>
                    Phone Number *
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </label>
                  {errors.phone && (
                    <span className="error-text">{errors.phone}</span>
                  )}
                </div>

                <div className={errors.address ? "wide error" : "wide"}>
                  <label>
                    Address *
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </label>
                  {errors.address && (
                    <span className="error-text">{errors.address}</span>
                  )}
                </div>

                <div className={errors.city ? "error" : ""}>
                  <label>
                    City *
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </label>
                  {errors.city && (
                    <span className="error-text">{errors.city}</span>
                  )}
                </div>
              </div>
            </fieldset>

            <fieldset className="checkout-card">
              <legend>eSewa Payment</legend>

              <div className="payment-info">
                <div className={errors.esewa_number ? "error" : ""}>
                  <label>
                    eSewa Number (Registered Mobile Number) *
                    <input
                      type="tel"
                      name="esewa_number"
                      value={formData.esewa_number}
                      onChange={handleChange}
                    />
                  </label>
                  {errors.esewa_number && (
                    <span className="error-text">{errors.esewa_number}</span>
                  )}
                </div>

                <div className={errors.esewa_password ? "error" : ""}>
                  <label>
                    eSewa Password *
                    <input
                      type="password"
                      name="esewa_password"
                      value={formData.esewa_password}
                      onChange={handleChange}
                    />
                  </label>
                  {errors.esewa_password && (
                    <span className="error-text">{errors.esewa_password}</span>
                  )}
                </div>

                <div className="payment-note">
                  <p>
                    💡 Your eSewa account will be charged Rs.{" "}
                    {calculateTotal().toLocaleString("en-IN")}
                  </p>
                  <p style={{ fontSize: "0.9rem", marginTop: "8px" }}>
                    Make sure you have sufficient balance in your eSewa account.
                  </p>
                </div>
              </div>
            </fieldset>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <p style={{ color: "#71635b", fontSize: "0.9rem" }}>
            {cartItems.length} item(s) in your cart
          </p>

          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <span>
                  {item.name}
                  <small>Qty: {item.quantity}</small>
                </span>
                <strong>
                  Rs. {(item.price * item.quantity).toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>

          <div className="summary-line">
            <span>Subtotal</span>
            <strong>Rs. {calculateSubtotal().toLocaleString("en-IN")}</strong>
          </div>

          <div className="summary-line">
            <span>Delivery Charge</span>
            <strong>
              Rs. {calculateDeliveryCharge().toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>Rs. {calculateTotal().toLocaleString("en-IN")}</strong>
          </div>

          <button onClick={handleEsewaPayment} className="place-order-button">
            Pay with eSewa • Rs. {calculateTotal().toLocaleString("en-IN")}
          </button>

          <p className="secure-note">🔒 Secure payment powered by eSewa</p>
        </div>
      </div>

      {/* eSewa Payment Modal */}
      {showEsewaModal && (
        <div className="modal-overlay" onClick={() => setShowEsewaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>eSewa Payment</h3>
              <button
                className="modal-close"
                onClick={() => setShowEsewaModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-details">
                <p>
                  <strong>Account:</strong> {formData.esewa_number}
                </p>
                <p>
                  <strong>Amount:</strong> Rs.{" "}
                  {calculateTotal().toLocaleString("en-IN")}
                </p>
                <p>
                  <strong>Merchant:</strong> Handicraft Store
                </p>
              </div>
              <div className="payment-loading">
                {isProcessing ? (
                  <div className="processing">
                    <div className="spinner"></div>
                    <p>Processing payment...</p>
                  </div>
                ) : (
                  <div className="confirm-buttons">
                    <button onClick={processPayment} className="confirm-btn">
                      Confirm Payment
                    </button>
                    <button
                      onClick={() => setShowEsewaModal(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutForm;