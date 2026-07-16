import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PremiumAsset } from './PremiumAsset';
import { X, Trash2, Plus, Minus, Ticket, CreditCard, CheckCircle } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    discountCode,
    applyCoupon,
    removeCoupon,
    updateCartQty,
    removeFromCart,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    checkout
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  // Form details
  const [shippingForm, setShippingForm] = useState({
    name: "Alex Mercer",
    address: "742 Evergreen Terrace",
    city: "Springfield",
    zip: "97477"
  });

  // Listen to toggle events
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
      setPlacedOrderId(null); // Reset checkout success state when toggled
      setIsCheckingOut(false);
    };

    window.addEventListener('toggle-cart', handleToggle);
    return () => window.removeEventListener('toggle-cart', handleToggle);
  }, []);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    if (!couponInput) return;
    
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput("");
    } else {
      setCouponError(res.message);
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const res = checkout(shippingForm);
    if (res.success) {
      setPlacedOrderId(res.orderId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={() => setIsOpen(false)}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="drawer-header">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Shopping Cart {cart.length > 0 && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>({cart.length} unique items)</span>}
          </h3>
          <button className="compare-remove-btn" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success screen */}
        {placedOrderId ? (
          <div className="drawer-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
            <CheckCircle className="w-16 h-16 text-emerald-400" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem' }}>Order Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Your order <strong style={{ color: 'var(--text-main)' }}>#{placedOrderId}</strong> has been successfully placed. We've charged your simulated payment method.
            </p>
            <div className="glass-panel" style={{ width: '100%', padding: '16px', fontSize: '0.85rem', textAlign: 'left', background: 'rgba(0,0,0,0.1)' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '6px' }}>Delivery Details</h4>
              <p style={{ color: 'var(--text-muted)' }}>Name: {shippingForm.name}</p>
              <p style={{ color: 'var(--text-muted)' }}>Address: {shippingForm.address}, {shippingForm.city}</p>
              <p style={{ color: 'var(--text-muted)' }}>Carrier: FedEx (Simulated)</p>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              You can track this order in the "My Orders" tab, or click the chatbot bubble to ask questions about shipping.
            </p>
            <button className="btn-primary" onClick={() => setIsOpen(false)} style={{ width: '100%' }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Drawer Body (Items list or checkout) */}
            <div className="drawer-content">
              {cart.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', padding: '20px' }}>
                  <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginBottom: '15px' }}>Your shopping cart is empty</p>
                  <button className="btn-secondary" onClick={() => setIsOpen(false)}>
                    Browse Storefront
                  </button>
                </div>
              ) : !isCheckingOut ? (
                // 1. SHOPPING LIST VIEW
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {cart.map(item => (
                    <div key={item.productId} className="glass-panel" style={{ padding: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      
                      {/* Product Visual */}
                      <div style={{ width: '60px', height: '60px', background: 'var(--bg-deep)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.product?.image ? (
                          <img src={item.product.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <PremiumAsset type={item.product?.iconName} color={item.product?.color} />
                        )}
                      </div>

                      {/* Product Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </h4>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>₹{item.price.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Quantity Toggles */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '6px' }}>
                        <button 
                          onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', transition: 'color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  ))}
                </div>
              ) : (
                // 2. CHECKOUT SHIPPING FORM
                <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                    Shipping Information
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      className="input-glass" 
                      value={shippingForm.name}
                      onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Street Address</label>
                    <input 
                      type="text" 
                      required 
                      className="input-glass" 
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>City</label>
                      <input 
                        type="text" 
                        required 
                        className="input-glass" 
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Zip Code</label>
                      <input 
                        type="text" 
                        required 
                        className="input-glass" 
                        value={shippingForm.zip}
                        onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                      />
                    </div>
                  </div>

                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', marginTop: '10px' }}>
                    Payment Mode
                  </h4>
                  <div className="glass-panel" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(99,102,241,0.05)', borderColor: 'rgba(99,102,241,0.2)' }}>
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    <div style={{ fontSize: '0.85rem' }}>
                      <p style={{ fontWeight: 600 }}>Mock Secure Sandbox</p>
                      <p style={{ color: 'var(--text-muted)' }}>Charges are simulated in session memory.</p>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                    Confirm & Authorize Payment
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setIsCheckingOut(false)} style={{ justifyContent: 'center' }}>
                    Back to Shopping Cart
                  </button>
                </form>
              )}
            </div>

            {/* Footer Summary (Sticky at bottom if drawer is open) */}
            {cart.length > 0 && (
              <div className="drawer-footer">
                
                {/* 1. Promo code input (Only in Cart View) */}
                {!isCheckingOut && (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <input 
                        type="text" 
                        className="input-glass" 
                        placeholder="Coupon (e.g. SAVE10)" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                      />
                      {couponError && <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '2px' }}>{couponError}</span>}
                    </div>
                    <button type="submit" className="btn-secondary" style={{ padding: '8px 15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Ticket className="w-4 h-4 text-indigo-400" /> Apply
                    </button>
                  </form>
                )}

                {/* 2. Active coupon badge */}
                {discountCode && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '6px 10px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>🎟️ CODE: {discountCode} Active</span>
                    <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                      <X className="w-4 h-4 hover:text-white" />
                    </button>
                  </div>
                )}

                {/* 3. Calculations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Subtotal</span>
                    <span>₹{getSubtotal().toLocaleString('en-IN')}</span>
                  </div>
                  {discountCode && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                      <span>Discount</span>
                      <span>-₹{getDiscountAmount().toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Shipping</span>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
                  </div>
                  <hr style={{ border: 'none', borderBottom: '1px solid var(--border-glass)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--primary)' }}>₹{getTotal().toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* 4. Action button */}
                {!isCheckingOut ? (
                  <button className="btn-primary" onClick={() => setIsCheckingOut(true)} style={{ width: '100%', justifyContent: 'center' }}>
                    Proceed to Simulated Checkout
                  </button>
                ) : null}

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
