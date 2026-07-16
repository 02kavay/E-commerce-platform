import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Sparkles, Layers, Package, MessageSquare } from 'lucide-react';

export const Header = () => {
  const { 
    cart, 
    selectedProductForComparison, 
    activeTab, 
    setActiveTab, 
    setChatOpen 
  } = useApp();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header>
      <div className="header-inner">
        {/* Logo with Glow */}
        <div className="logo" onClick={() => setActiveTab("catalog")} style={{ cursor: 'pointer' }}>
          <Sparkles className="w-6 h-6 text-indigo-500" />
          <span>ShopAssist <span style={{ color: '#A855F7' }}>AI</span></span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <button 
            className={`nav-link ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            Storefront
          </button>
          
          <button 
            className={`nav-link ${activeTab === 'compare' ? 'active' : ''}`}
            onClick={() => setActiveTab('compare')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Layers className="w-4 h-4" />
            Compare
            {selectedProductForComparison.length > 0 && (
              <span style={{
                background: 'var(--primary)',
                color: 'white',
                fontSize: '0.65rem',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 'bold'
              }}>
                {selectedProductForComparison.length}
              </span>
            )}
          </button>

          <button 
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Package className="w-4 h-4" />
            My Orders
          </button>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* AI Chat Button */}
          <button 
            className="btn-secondary"
            onClick={() => setChatOpen(prev => !prev)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border-glow)' }}
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span style={{ fontSize: '0.9rem' }}>Chatbot</span>
          </button>

          {/* Cart Icon Button */}
          <button 
            className="cart-icon-btn" 
            onClick={() => {
              // Trigger click event for cart drawer open
              const event = new CustomEvent('toggle-cart');
              window.dispatchEvent(event);
            }}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="cart-text" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Cart</span>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
