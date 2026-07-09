// frontend/src/components/ShoppingCart.jsx
function ShoppingCart({ cart, onCheckout }) {
  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    }
  };

  // Get items from cart
  const cartItems = cart?.items || [];
  const total = cart?.total || 0;

  console.log("🛒 ShoppingCart rendered with:", {
    items: cartItems,
    total: total,
    count: cart?.count
  });

  return (
    <section className="cart-section" aria-label="Shopping cart">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Your cart</p>
          <h2>Selected products</h2>
        </div>
        <div className="cart-summary">
          <strong>Total: Rs. {total?.toLocaleString("en-IN") || 0}</strong>
          <button 
            disabled={cartItems.length === 0} 
            onClick={handleCheckout}
          >
            Checkout ({cartItems.length} items)
          </button>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          Your cart is empty. Add products from the collection below.
        </div>
      ) : (
        <div className="cart-list">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id || item._id}>
              <img 
                src={item.img || item.image || "https://via.placeholder.com/100"} 
                alt={item.name} 
              />
              <div>
                <h3>{item.name}</h3>
                <p>Rs. {item.price?.toLocaleString("en-IN")} each</p>
              </div>
              <div className="quantity-controls">
                <button 
                  onClick={() => cart.decreaseItem?.(item.id || item._id)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  disabled={item.quantity >= (item.stock || 0)}
                  onClick={() => cart.addToCart?.(item, 1)}
                >
                  +
                </button>
              </div>
              <strong>
                Rs. {((item.price || 0) * (item.quantity || 0))?.toLocaleString("en-IN")}
              </strong>
              <button
                className="remove-button"
                onClick={() => cart.removeItem?.(item.id || item._id)}
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ShoppingCart;