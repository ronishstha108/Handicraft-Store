// frontend/src/components/CheckoutForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../services/orderService";
import KhaltiPayment from "./KhaltiPayment";

function CheckoutForm({ cart }) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKhaltiModal, setShowKhaltiModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  console.log("🛒 CheckoutForm received cart:", cart);
  console.log("🛒 Cart items:", cart?.items);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Prefill from the logged-in user's saved details (still editable if they want to change anything)
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (userData && (userData.first_name || userData.email)) {
        setFormData((prev) => ({
          ...prev,
          first_name: userData.first_name || prev.first_name,
          last_name: userData.last_name || prev.last_name,
          email: userData.email || prev.email,
          phone: userData.phone || prev.phone,
          address: userData.address || prev.address,
        }));
      }
    } catch (err) {
      console.error("Could not prefill checkout form from saved user data:", err);
    }
  }, []);

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

  // Create order and get order ID
  const createOrder = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return null;
    }

    setIsProcessing(true);

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");
      
      console.log("👤 User data:", userData);
      console.log("🔑 Token exists:", !!token);

      const orderData = {
        customer: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
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
        paymentMethod: "Pending",
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        orderDate: new Date().toISOString(),
        status: "Pending",
        user: userData.id,
        paymentStatus: "Pending"
      };

      console.log("📦 Sending order to API:", orderData);

      const response = await orderService.createOrder(orderData);
      console.log("📡 Order API response:", response);

      const newOrder = response.data || response;
      const newOrderId = newOrder._id || newOrder.id;
      setOrderId(newOrderId);

      // Save to localStorage as backup
      const existingOrders = localStorage.getItem("orderHistory");
      let orders = [];
      if (existingOrders) {
        orders = JSON.parse(existingOrders);
      }
      orders.unshift(newOrder);
      localStorage.setItem("orderHistory", JSON.stringify(orders));

      return newOrderId;

    } catch (error) {
      console.error("❌ Order error:", error);
      alert(`❌ Order failed: ${error.response?.data?.message || error.message}`);
      setIsProcessing(false);
      return null;
    }
  };

  const handleKhaltiPayment = async () => {
    const orderId = await createOrder();
    if (orderId) {
      setSelectedPayment('khalti');
      setShowKhaltiModal(true);
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (data) => {
    console.log('Payment successful:', data);
    setShowKhaltiModal(false);
    setIsProcessing(false);
    alert(`✅ Payment Successful! Order ID: #${orderId}`);
    cart.clearCart();
    navigate("/orders");
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    setShowKhaltiModal(false);
    setIsProcessing(false);
    alert(`❌ Payment failed: ${error.message}`);
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

          {/* Khalti Payment Button */}
          <button 
            onClick={handleKhaltiPayment} 
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '14px',
              background: isProcessing ? '#999' : '#5C2D91',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) {
                e.target.style.background = '#7B3FAF';
              }
            }}
            onMouseLeave={(e) => {
              if (!isProcessing) {
                e.target.style.background = '#5C2D91';
              }
            }}
          >
            {isProcessing ? 'Processing Order...' : `💰 Pay with Khalti • Rs. ${calculateTotal().toLocaleString("en-IN")}`}
          </button>

          <p className="secure-note" style={{ marginTop: '12px' }}>
            🔒 Secure payment powered by Khalti
          </p>
        </div>
      </div>

      {/* Khalti Payment Modal */}
      {showKhaltiModal && orderId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Complete Khalti Payment</h2>
            <p style={{ textAlign: 'center', color: '#71635b', marginBottom: '24px' }}>
              You will be redirected to Khalti to complete your payment.
            </p>
            
            <KhaltiPayment 
              orderId={orderId}
              totalAmount={calculateTotal()}
              customerInfo={{
                name: formData.first_name + ' ' + formData.last_name,
                email: formData.email,
                phone: formData.phone
              }}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
            
            <button
              onClick={() => {
                setShowKhaltiModal(false);
                setIsProcessing(false);
              }}
              style={{
                display: 'block',
                margin: '12px auto 0',
                padding: '8px 20px',
                background: 'transparent',
                border: 'none',
                color: '#71635b',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutForm;