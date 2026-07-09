// frontend/src/context/ShoppingCartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ShoppingCartContext = createContext();

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error("useShoppingCart must be used within ShoppingCartProvider");
  }
  return context;
};

export const ShoppingCartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shoppingCart");
    console.log("📦 Loading cart from localStorage:", savedCart);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          console.log("✅ Cart loaded:", parsed);
        } else {
          console.log("⚠️ Cart is empty in localStorage");
          setItems([]);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        setItems([]);
      }
    } else {
      console.log("⚠️ No cart found in localStorage");
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log("💾 Saving cart to localStorage:", items);
    localStorage.setItem("shoppingCart", JSON.stringify(items));
  }, [items]);

  // Add item to cart
  const addItem = (product, quantity = 1) => {
    console.log("🛒 Adding to cart:", product, quantity);
    
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Check stock limit
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          alert(`Only ${product.stock} items available in stock`);
          return prevItems;
        }
        // Update quantity if item exists
        const updatedItems = prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
        console.log("🛒 Updated existing item:", updatedItems);
        return updatedItems;
      } else {
        // Check stock limit
        if (quantity > product.stock) {
          alert(`Only ${product.stock} items available in stock`);
          return prevItems;
        }
        // Add new item with all required properties
        const newItem = { 
          id: product.id || product._id,
          name: product.name,
          price: product.price,
          img: product.img || product.image || "https://via.placeholder.com/100",
          stock: product.stock || 0,
          category: product.category || "",
          quantity: quantity 
        };
        console.log("🛒 Added new item:", newItem);
        return [...prevItems, newItem];
      }
    });
  };

  // Add to cart alias
  const addToCart = (product, quantity = 1) => {
    console.log("🛒 addToCart called with:", product, quantity);
    addItem(product, quantity);
  };

  // Decrease item quantity
  const decreaseItem = (productId) => {
    console.log("🛒 Decreasing item:", productId);
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (!existingItem) return prevItems;

      if (existingItem.quantity <= 1) {
        return prevItems.filter((item) => item.id !== productId);
      } else {
        return prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
    });
  };

  // Remove item from cart
  const removeItem = (productId) => {
    console.log("🛒 Removing item:", productId);
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === productId);
      if (item && quantity > item.stock) {
        alert(`Only ${item.stock} items available in stock`);
        return prevItems;
      }
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      );
    });
  };

  // Clear entire cart
  const clearCart = () => {
    console.log("🛒 Clearing cart");
    setItems([]);
    localStorage.removeItem("shoppingCart");
  };

  // Get total items count
  const getTotalItems = () => {
    const count = items.reduce((total, item) => total + (item.quantity || 0), 0);
    console.log("🛒 Total items count:", count);
    return count;
  };

  // Get total price
  const getTotalPrice = () => {
    const total = items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
    console.log("🛒 Total price:", total);
    return total;
  };

  // Get all cart items
  const getItems = () => {
    console.log("🛒 Getting cart items:", items);
    return items;
  };

  const value = {
    items: getItems(),
    getItems,
    addItem,
    addToCart,
    decreaseItem,
    removeItem,
    updateQuantity,
    clearCart,
    count: getTotalItems(),
    total: getTotalPrice(),
    totalPrice: getTotalPrice(),
  };

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  );
};