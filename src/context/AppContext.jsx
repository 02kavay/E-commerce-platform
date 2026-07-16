import React, { createContext, useState, useContext, useEffect } from 'react';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_COUPONS } from '../utils/mockData';
import { processMessage } from '../utils/aiEngine';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0); // decimal representing percentage discount
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "Hi! I'm **ShopAssist AI**, your shopping companion. 🌟\n\nI can help you:\n* 🔍 **Search** for products (e.g. *\"wireless earbuds under ₹5000\"*)\n* 📊 **Compare** items (e.g. *\"compare earbuds and headphones\"*)\n* 🛒 **Manage your cart** (e.g. *\"add shoes to cart\"* or *\"apply coupon SAVE10\"*)\n* 📦 **Track orders** (e.g. *\"where is my order ORD-1002?\"*)\n* ↩️ **Request returns** (e.g. *\"I want to return my shoe\"*)\n* 🤝 **Connect with human support**\n\nWhat can I help you find today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "rich"
    }
  ]);
  const [currentAgent, setCurrentAgent] = useState({
    name: "ShopAssist AI",
    avatar: "🤖",
    isHuman: false
  });
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProductForComparison, setSelectedProductForComparison] = useState([]);
  const [activeTab, setActiveTab] = useState("catalog"); // catalog, orders, compare
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 20000]);

  // Cart operations
  const addToCart = (productId, quantity = 1, silent = false) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: "Product not found" };
    if (product.stock < quantity) {
      return { success: false, message: `Sorry, only ${product.stock} items left in stock.` };
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.productId === productId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          return prevCart; // Cap at stock
        }
        return prevCart.map(item =>
          item.productId === productId ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevCart, { productId, name: product.name, price: product.price, quantity, product }];
    });

    if (!silent) {
      triggerConfetti(0.1);
    }
    return { success: true, message: `Added ${product.name} to cart.` };
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    return { success: true, message: "Item removed from cart." };
  };

  const updateCartQty = (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product || quantity <= 0) return removeFromCart(productId);
    if (quantity > product.stock) {
      return { success: false, message: `Only ${product.stock} items available.` };
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
    return { success: true, message: "Cart updated." };
  };

  const applyCoupon = (code) => {
    const cleanCode = code.toUpperCase().trim();
    if (MOCK_COUPONS[cleanCode] !== undefined) {
      setDiscountCode(cleanCode);
      setDiscountValue(MOCK_COUPONS[cleanCode]);
      return { success: true, discount: MOCK_COUPONS[cleanCode], message: `Coupon ${cleanCode} applied! Saved ${(MOCK_COUPONS[cleanCode]*100)}%.` };
    }
    return { success: false, message: "Invalid discount coupon code." };
  };

  const removeCoupon = () => {
    setDiscountCode("");
    setDiscountValue(0);
  };

  // Cart Calculations
  const getSubtotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const getDiscountAmount = () => getSubtotal() * discountValue;
  const getTotal = () => Math.max(0, getSubtotal() - getDiscountAmount());

  // Checkout simulation
  const checkout = (shippingDetails) => {
    if (cart.length === 0) return { success: false, message: "Cart is empty" };

    // Update inventory stock
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const cartItem = cart.find(item => item.productId === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    // Create new order
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      total: Number(getTotal().toFixed(2)),
      status: "Processing",
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      shipping: {
        name: shippingDetails.name || "Customer",
        address: shippingDetails.address || "123 Main St",
        city: shippingDetails.city || "Springfield",
        zip: shippingDetails.zip || "12345",
        carrier: "FedEx",
        tracking: `TRK-${Math.floor(1000000 + Math.random() * 9000000)}`
      },
      timeline: [
        { date: new Date().toLocaleString(), status: "Order Placed", desc: "Payment processed via checkout simulator." },
        { date: new Date().toLocaleString(), status: "Processing", desc: "Verifying stock levels and queueing shipment." }
      ]
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setCart([]);
    removeCoupon();
    triggerConfetti(0.5);

    // Send AI message about confirmation
    addBotMessage(`🎉 **Thank you for your order!** Your order **${orderId}** has been successfully placed. Total paid: **₹${newOrder.total}**.\n\nYou can track this order in the "Orders" tab or ask me: *"where is order ${orderId}?"*`);

    return { success: true, orderId, order: newOrder };
  };

  // Order operations
  const cancelOrder = (orderId) => {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return { success: false, message: "Order not found." };
    
    const order = orders[orderIndex];
    if (order.status !== "Processing" && order.status !== "In Transit") {
      return { success: false, message: `Cannot cancel an order that is already ${order.status}.` };
    }

    setOrders(prevOrders =>
      prevOrders.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: "Cancelled",
              timeline: [...o.timeline, { date: new Date().toLocaleString(), status: "Cancelled", desc: "Order cancelled by customer." }]
            }
          : o
      )
    );

    // Return stock
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const orderItem = order.items.find(item => item.productId === p.id);
        if (orderItem) {
          return { ...p, stock: p.stock + orderItem.quantity };
        }
        return p;
      })
    );

    return { success: true, message: `Your order ${orderId} has been successfully cancelled and fully refunded.` };
  };

  const returnOrder = (orderId, reason = "Doesn't fit") => {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return { success: false, message: "Order not found." };
    
    const order = orders[orderIndex];
    if (order.status !== "Delivered") {
      return { success: false, message: `Returns are only eligible for Delivered orders.` };
    }

    setOrders(prevOrders =>
      prevOrders.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: "Returned",
              timeline: [...o.timeline, { date: new Date().toLocaleString(), status: "Returned", desc: `Return approved. Reason: ${reason}. Refund processing.` }]
            }
          : o
      )
    );

    // Return stock
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const orderItem = order.items.find(item => item.productId === p.id);
        if (orderItem) {
          return { ...p, stock: p.stock + orderItem.quantity };
        }
        return p;
      })
    );

    return { success: true, message: `Return initialized for order ${orderId}. A full refund has been credited to your payment method.` };
  };

  // Particle explosion for premium feedback
  const triggerConfetti = (scalar = 0.2) => {
    confetti({
      particleCount: Math.floor(100 * scalar),
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366F1', '#A855F7', '#F59E0B', '#10B981']
    });
  };

  // Comparison Management
  const toggleComparison = (product) => {
    setSelectedProductForComparison(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 products at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const clearComparison = () => {
    setSelectedProductForComparison([]);
  };

  // Bot Messaging System
  const addBotMessage = (text, type = "text", customData = null) => {
    setChatMessages(prev => [
      ...prev,
      {
        id: `msg-bot-${Date.now()}`,
        sender: "bot",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type,
        customData
      }
    ]);
  };

  const addUserMessage = (text) => {
    setChatMessages(prev => [
      ...prev,
      {
        id: `msg-user-${Date.now()}`,
        sender: "user",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleUserSendMessage = async (text) => {
    if (!text.trim()) return;

    addUserMessage(text);
    setIsTyping(true);

    // Simulate AI thinking and typing latency
    setTimeout(() => {
      const stateForAI = {
        products,
        cart,
        orders,
        discountCode,
        currentAgent
      };

      const actionHandlers = {
        addToCart: (pid, qty) => addToCart(pid, qty),
        removeFromCart: (pid) => removeFromCart(pid),
        applyCoupon: (code) => applyCoupon(code),
        cancelOrder: (oid) => cancelOrder(oid),
        returnOrder: (oid, reason) => returnOrder(oid, reason),
        escalateToHuman: () => escalateToHuman(),
        openComparison: () => {
          setActiveTab("compare");
        },
        openOrders: () => {
          setActiveTab("orders");
        }
      };

      const response = processMessage(text, stateForAI, actionHandlers);
      
      setIsTyping(false);
      addBotMessage(response.text, response.type, response.customData);
    }, 1200);
  };

  // Escalate to human operator simulation
  const escalateToHuman = () => {
    setIsTyping(true);
    setTimeout(() => {
      setCurrentAgent({
        name: "Sarah (Customer Support)",
        avatar: "👩‍💼",
        isHuman: true
      });
      setIsTyping(false);
      addBotMessage("👋 **Welcome!** My name is **Sarah**, I am a customer support lead. I've taken over from the automated assistant. I have reviewed your chat logs.\n\nHow can I help you resolve this issue today? I can manually override orders, process returns, or answer any customized inquiries.", "text");
    }, 1500);
    return { success: true, message: "Connecting to support representative..." };
  };

  const resetChat = () => {
    setCurrentAgent({
      name: "ShopAssist AI",
      avatar: "🤖",
      isHuman: false
    });
    setChatMessages([
      {
        id: "msg-welcome",
        sender: "bot",
        text: "Hi! I'm **ShopAssist AI**, your shopping companion. 🌟\n\nI can help you:\n* 🔍 **Search** for products (e.g. *\"wireless earbuds under $50\"*)\n* 📊 **Compare** items (e.g. *\"compare earbuds and headphones\"*)\n* 🛒 **Manage your cart** (e.g. *\"add shoes to cart\"* or *\"apply coupon SAVE10\"*)\n* 📦 **Track orders** (e.g. *\"where is my order ORD-1002?\"*)\n* ↩️ **Request returns** (e.g. *\"I want to return my shoe\"*)\n* 🤝 **Connect with human support**\n\nWhat can I help you find today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "rich"
      }
    ]);
  };

  return (
    <AppContext.Provider value={{
      products,
      cart,
      orders,
      discountCode,
      discountValue,
      chatOpen,
      chatMessages,
      currentAgent,
      isTyping,
      selectedProductForComparison,
      activeTab,
      searchQuery,
      categoryFilter,
      priceRange,
      setChatOpen,
      setActiveTab,
      setSearchQuery,
      setCategoryFilter,
      setPriceRange,
      addToCart,
      removeFromCart,
      updateCartQty,
      applyCoupon,
      removeCoupon,
      getSubtotal,
      getDiscountAmount,
      getTotal,
      checkout,
      cancelOrder,
      returnOrder,
      toggleComparison,
      clearComparison,
      handleUserSendMessage,
      escalateToHuman,
      resetChat,
      triggerConfetti
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
