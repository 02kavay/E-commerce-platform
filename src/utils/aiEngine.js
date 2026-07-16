export const processMessage = (text, appState, actionHandlers) => {
  const query = text.toLowerCase().trim();
  const { products, cart, orders, discountCode, currentAgent } = appState;

  // If we are already in human support mode, we simulate a helpful human response
  if (currentAgent.isHuman) {
    return handleHumanAgentResponse(query);
  }

  // --- 1. ESCALATE TO HUMAN SUPPORT ---
  if (
    query.includes("human") || 
    query.includes("agent") || 
    query.includes("operator") || 
    query.includes("person") || 
    query.includes("support lead") || 
    query.includes("representative") ||
    query.includes("complaint") ||
    query.includes("manager") ||
    query.includes("talk to a real")
  ) {
    actionHandlers.escalateToHuman();
    return {
      text: "Transferring you to a live chat representative now. Please hold...",
      type: "text"
    };
  }

  // --- 2. ORDER TRACKING & STATUS ---
  // Match ORD-XXXX or order numbers
  const orderMatch = query.match(/ord-\d{4}/i);
  if (orderMatch) {
    const orderId = orderMatch[0].toUpperCase();
    const foundOrder = orders.find(o => o.id === orderId);

    if (foundOrder) {
      return {
        text: `Found your order **${orderId}**! Here is the live status and tracking details:`,
        type: "order_tracker",
        customData: foundOrder
      };
    } else {
      return {
        text: `Sorry, I couldn't find any order with ID **${orderId}**. Please check the ID and try again, or select one of your recent orders below:`,
        type: "order_list",
        customData: orders
      };
    }
  }

  if (query.includes("track") || query.includes("order status") || query.includes("where is my order")) {
    if (orders.length > 0) {
      return {
        text: "Sure! Which of your recent orders would you like to track?",
        type: "order_list",
        customData: orders
      };
    } else {
      return {
        text: "You don't have any placed orders in your session history yet. Add some items to your cart and complete checkout to see order tracking in action!",
        type: "text"
      };
    }
  }

  // --- 3. RETURNS & REFUNDS ---
  if (query.includes("return") || query.includes("refund") || query.includes("send back") || query.includes("exchange")) {
    // Check if there are delivered orders
    const deliveredOrders = orders.filter(o => o.status === "Delivered");
    
    if (deliveredOrders.length > 0) {
      // Check if they already specified a delivered order in their text
      const specDelivered = deliveredOrders.find(o => query.includes(o.id.toLowerCase()));
      if (specDelivered) {
        return {
          text: `You are initiating a return for order **${specDelivered.id}** (${specDelivered.items.map(i => i.name).join(", ")}). \n\nOur policy offers 100% money-back refunds. Do you confirm you want to proceed with this return?`,
          type: "return_confirmation",
          customData: { orderId: specDelivered.id, order: specDelivered }
        };
      }
      
      return {
        text: "I can help process your return. Which of your eligible **Delivered** orders would you like to return?",
        type: "return_eligible_list",
        customData: deliveredOrders
      };
    } else {
      const pendingOrders = orders.filter(o => o.status === "In Transit" || o.status === "Processing");
      if (pendingOrders.length > 0) {
        return {
          text: "Your current orders are still in transit or processing, so they aren't eligible for return yet. If you want to cancel a processing order instead, select it from your orders list:",
          type: "order_list",
          customData: pendingOrders
        };
      }
      return {
        text: "I couldn't find any orders in your history that are eligible for a return. Returns are available for items in **Delivered** status within 30 days of purchase.",
        type: "text"
      };
    }
  }

  // Handle return confirmation click
  if (query.startsWith("confirm_return_")) {
    const orderId = query.replace("confirm_return_", "").toUpperCase();
    const result = actionHandlers.returnOrder(orderId);
    if (result.success) {
      return {
        text: `✅ **Return Processed!**\n\nYour order **${orderId}** has been successfully returned and a full refund has been issued. The restocked items have been returned to our inventory catalog.`,
        type: "text"
      };
    } else {
      return {
        text: `Error: ${result.message}`,
        type: "text"
      };
    }
  }

  if (query.startsWith("cancel_order_")) {
    const orderId = query.replace("cancel_order_", "").toUpperCase();
    const result = actionHandlers.cancelOrder(orderId);
    if (result.success) {
      return {
        text: `🚫 **Order Cancelled!**\n\nYour order **${orderId}** has been successfully cancelled and fully refunded.`,
        type: "text"
      };
    } else {
      return {
        text: `Error: ${result.message}`,
        type: "text"
      };
    }
  }

  // --- 4. PRODUCT COMPARISON ---
  if (
    query.includes("compare") || 
    query.includes("vs") || 
    query.includes("versus") || 
    query.includes("difference between")
  ) {
    // Identify which products they want to compare
    const matchProducts = [];
    if (query.includes("earbud") || query.includes("soundflow") || query.includes("sound flow")) {
      matchProducts.push(products.find(p => p.id === "prod-1"));
    }
    if (query.includes("headphone") || query.includes("aurabeats") || query.includes("aura beats")) {
      matchProducts.push(products.find(p => p.id === "prod-2"));
    }
    if (query.includes("shoe") || query.includes("runner") || query.includes("apex")) {
      matchProducts.push(products.find(p => p.id === "prod-3"));
    }
    if (query.includes("boot") || query.includes("leather") || query.includes("vanguard")) {
      matchProducts.push(products.find(p => p.id === "prod-4"));
    }
    if (query.includes("jacket") || query.includes("windbreaker") || query.includes("aeroshield")) {
      matchProducts.push(products.find(p => p.id === "prod-5"));
    }
    if (query.includes("backpack") || query.includes("bag") || query.includes("nomad")) {
      matchProducts.push(products.find(p => p.id === "prod-6"));
    }
    if (query.includes("watch") || query.includes("smart watch") || query.includes("chronos")) {
      matchProducts.push(products.find(p => p.id === "prod-7"));
    }
    if (query.includes("bottle") || query.includes("titanium")) {
      matchProducts.push(products.find(p => p.id === "prod-8"));
    }

    // Filter nulls just in case
    const cleanMatches = matchProducts.filter(Boolean);

    if (cleanMatches.length >= 2) {
      actionHandlers.openComparison();
      return {
        text: `Sure! I've loaded a side-by-side comparison for **${cleanMatches[0].name}** and **${cleanMatches[1].name}** in the main window, and compiled this quick comparison table:`,
        type: "comparison_table",
        customData: cleanMatches.slice(0, 3)
      };
    } else if (query.includes("earbud") || query.includes("headphone") || query.includes("audio")) {
      const items = [products.find(p => p.id === "prod-1"), products.find(p => p.id === "prod-2")].filter(Boolean);
      actionHandlers.openComparison();
      return {
        text: "Here is a comparison of our premium audio offerings:",
        type: "comparison_table",
        customData: items
      };
    } else if (query.includes("shoe") || query.includes("boot") || query.includes("footwear")) {
      const items = [products.find(p => p.id === "prod-3"), products.find(p => p.id === "prod-4")].filter(Boolean);
      actionHandlers.openComparison();
      return {
        text: "Here is a side-by-side of our running shoes vs rugged leather boots:",
        type: "comparison_table",
        customData: items
      };
    } else {
      return {
        text: "Which products would you like to compare? You can say something like *\"compare earbuds and headphones\"* or *\"compare running shoes and boots\"*.",
        type: "text"
      };
    }
  }

  // --- 5. CART MANAGEMENT & COUPONS ---
  
  // Apply Coupons
  const couponMatch = query.match(/(save10|welcome20|freeship|cyber30)/i);
  if (couponMatch || query.includes("coupon") || query.includes("discount code") || query.includes("promo")) {
    let couponCode = couponMatch ? couponMatch[0].toUpperCase() : null;
    
    // If they typed coupon but didn't list it
    if (!couponCode) {
      const words = query.split(/\s+/);
      // Try to find a capitalized-like word or just some alphanumeric code
      for (const word of words) {
        if (word.length >= 5 && /^[A-Z0-9]+$/i.test(word)) {
          couponCode = word.toUpperCase();
          break;
        }
      }
    }

    if (couponCode) {
      const result = actionHandlers.applyCoupon(couponCode);
      if (result.success) {
        return {
          text: `🎟️ **Coupon Applied Successfully!**\n\nI have applied the code **${couponCode}** to your cart. You have received a discount of **${result.discount * 100}%** on your order subtotal!`,
          type: "text"
        };
      } else {
        return {
          text: `❌ **Failed to apply coupon:** ${result.message} Please check that it is written correctly (e.g., **SAVE10**, **WELCOME20**, **CYBER30**).`,
          type: "text"
        };
      }
    } else {
      return {
        text: "Which coupon code would you like to apply? You can try: **SAVE10** (10% off), **WELCOME20** (20% off), or **CYBER30** (30% off). Just say *\"apply coupon SAVE10\"*!",
        type: "text"
      };
    }
  }

  // Add Item to Cart
  if (query.includes("add") && (query.includes("cart") || query.includes("bag") || query.includes("buy"))) {
    let targetProduct = null;
    if (query.includes("earbud") || query.includes("soundflow") || query.includes("sound flow")) {
      targetProduct = products.find(p => p.id === "prod-1");
    } else if (query.includes("headphone") || query.includes("aurabeats") || query.includes("aura beats")) {
      targetProduct = products.find(p => p.id === "prod-2");
    } else if (query.includes("runner") || query.includes("running shoe") || query.includes("apex")) {
      targetProduct = products.find(p => p.id === "prod-3");
    } else if (query.includes("boot") || query.includes("leather boot") || query.includes("vanguard")) {
      targetProduct = products.find(p => p.id === "prod-4");
    } else if (query.includes("windbreaker") || query.includes("jacket") || query.includes("aeroshield")) {
      targetProduct = products.find(p => p.id === "prod-5");
    } else if (query.includes("backpack") || query.includes("bag") || query.includes("nomad")) {
      targetProduct = products.find(p => p.id === "prod-6");
    } else if (query.includes("watch") || query.includes("smart watch") || query.includes("chronos")) {
      targetProduct = products.find(p => p.id === "prod-7");
    } else if (query.includes("bottle") || query.includes("titanium")) {
      targetProduct = products.find(p => p.id === "prod-8");
    } else {
      // Try fuzzy search name
      targetProduct = products.find(p => query.includes(p.name.toLowerCase()));
    }

    if (targetProduct) {
      if (targetProduct.stock === 0) {
        // Handle OUT OF STOCK recommendations!
        let alternativeText = `Ah! The **${targetProduct.name}** is currently **out of stock**. \n\nHowever, I highly recommend our `;
        if (targetProduct.category === "Accessories") {
          alternativeText += `**Nomad Commuter Backpack** (₹5,999, Rated 4.8⭐), which is in stock!`;
        } else if (targetProduct.category === "Electronics") {
          alternativeText += `**SoundFlow Wireless Earbuds** (₹3,999, Rated 4.7⭐) as a stellar high-tech alternative.`;
        } else {
          alternativeText += `**Apex Runner Pro Shoes** (₹6,999, Rated 4.6⭐) as a premium alternative.`;
        }
        alternativeText += `\n\nWould you like me to show you that instead?`;
        return {
          text: alternativeText,
          type: "text"
        };
      }

      // Check stock and add
      const result = actionHandlers.addToCart(targetProduct.id, 1);
      if (result.success) {
        return {
          text: `🛒 **Added to Cart!**\n\nI have added **1x ${targetProduct.name}** (₹${targetProduct.price}) to your shopping cart. Your subtotal has been updated in the checkout pane.`,
          type: "text"
        };
      } else {
        return {
          text: `Sorry, I couldn't add it: ${result.message}`,
          type: "text"
        };
      }
    } else {
      return {
        text: "I couldn't verify which item you wanted to add to the cart. What is the name of the product? (e.g. *\"add wireless earbuds to cart\"*)",
        type: "text"
      };
    }
  }

  // --- 6. SEARCH & RECOMMENDATIONS ---
  // Parsing Price limits (supports $, ₹, rs, etc.)
  let priceLimit = null;
  const underMatch = query.match(/(?:under|less than|below)\s*(?:\$|₹|rs\.?)?\s*(\d+)/i);
  if (underMatch) {
    priceLimit = parseFloat(underMatch[1]);
  }

  // Check matching category/keywords
  let searchResults = [...products];

  // Filters based on keywords
  let subCategorySearched = null;
  if (query.includes("earbud") || query.includes("headphone") || query.includes("audio") || query.includes("speaker") || query.includes("soundbar") || query.includes("mic") || query.includes("dac")) {
    searchResults = searchResults.filter(p => p.subCategory === "Audio");
    subCategorySearched = "Audio";
  } else if (query.includes("watch") || query.includes("smart watch") || query.includes("wearable") || query.includes("ring") || query.includes("band") || query.includes("vr") || query.includes("headset")) {
    searchResults = searchResults.filter(p => p.subCategory === "Wearables");
    subCategorySearched = "Wearables";
  } else if (query.includes("keyboard") || query.includes("mouse") || query.includes("mice") || query.includes("pad") || query.includes("keycap") || query.includes("numpad")) {
    searchResults = searchResults.filter(p => p.subCategory === "Keyboards & Mice");
    subCategorySearched = "Keyboards & Mice";
  } else if (query.includes("camera") || query.includes("bulb") || query.includes("light") || query.includes("plug") || query.includes("lock") || query.includes("purifier") || query.includes("doorbell") || query.includes("thermostat") || query.includes("gateway") || query.includes("sensor")) {
    searchResults = searchResults.filter(p => p.subCategory === "Smart Home");
    subCategorySearched = "Smart Home";
  } else if (query.includes("power") || query.includes("cable") || query.includes("charger") || query.includes("dock") || query.includes("surge") || query.includes("adapter") || query.includes("organizer")) {
    searchResults = searchResults.filter(p => p.subCategory === "Power & Cables");
    subCategorySearched = "Power & Cables";
  }

  // Filters based on price
  if (priceLimit) {
    searchResults = searchResults.filter(p => p.price <= priceLimit);
  }

  // Check direct product name match
  const directMatch = products.filter(p => query.includes(p.name.toLowerCase()) || p.name.toLowerCase().split(" ").some(word => word.length > 3 && query.includes(word)));

  // Decide what search outcome we got
  if (priceLimit || subCategorySearched || directMatch.length > 0) {
    let finalResults = searchResults;
    if (directMatch.length > 0 && !subCategorySearched && !priceLimit) {
      finalResults = directMatch;
    }

    if (finalResults.length > 0) {
      const priceText = priceLimit ? ` under **₹${priceLimit}**` : "";
      const catText = subCategorySearched ? ` in **${subCategorySearched}**` : "";
      return {
        text: `Here are the top matches I found${catText}${priceText}:`,
        type: "product_list",
        customData: finalResults
      };
    } else {
      const altProducts = products.slice(0, 3);
      return {
        text: `I couldn't find any products matching that specific description or price limit. Here are some of our best-selling featured items instead:`,
        type: "product_list",
        customData: altProducts
      };
    }
  }

  // --- 7. GENERAL HELP & GREETINGS ---
  if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("greetings") || query.includes("shopassist")) {
    return {
      text: "Hello! 👋 I'm **ShopAssist AI**, your shopping companion. What are you looking to buy, compare, or track today? You can ask me to *\"show running shoes under ₹8000\"* or *\"track order ORD-1002\"*.",
      type: "text"
    };
  }

  if (query.includes("thank") || query.includes("thanks") || query.includes("great") || query.includes("awesome")) {
    return {
      text: "You're very welcome! I'm happy to help. Let me know if you need anything else, or if you'd like to apply a discount like **SAVE10** to your order!",
      type: "text"
    };
  }

  // Default response
  return {
    text: "Hmm, I didn't quite catch that. I am trained to search products, compare specifications, manage your cart, apply coupons, and track or return orders.\n\n* To find something: *\"Show me windbreakers\"* or *\"earbuds under ₹5000\"*\n* To check orders: *\"Where is order ORD-1002?\"*\n* To return: *\"I want to return an order\"*\n* Or speak to a representative: *\"Connect me to a human support agent\"*",
    type: "text"
  };
};

// Simulated responses for Sarah (Human support)
const handleHumanAgentResponse = (query) => {
  const responses = [
    "I understand completely. Let me check our warehouse manager files directly for you. One moment.",
    "I've initiated a manual override for that tracking status. The carrier should update it within 2 hours.",
    "That is absolutely no problem. I can waive the return shipment fee for you as a courtesy. Would you like me to process that now?",
    "I see what happened there. I've updated your shipping address to ensure it arrives at your new location.",
    "Is there anything else I can assist you with regarding this request, or any other items in your cart?"
  ];

  if (query.includes("yes") || query.includes("confirm") || query.includes("sure") || query.includes("proceed")) {
    return {
      text: "Understood. I have executed that manual change on your account profile. You will receive an email confirmation shortly. Let me know if there's anything else I can do!",
      type: "text"
    };
  }

  if (query.includes("thank") || query.includes("thanks") || query.includes("perfect")) {
    return {
      text: "It was my absolute pleasure! Thank you for shopping with us today. Have an amazing day ahead!",
      type: "text"
    };
  }

  // Random helpful support response
  const randIndex = Math.floor(Math.random() * responses.length);
  return {
    text: responses[randIndex],
    type: "text"
  };
};
