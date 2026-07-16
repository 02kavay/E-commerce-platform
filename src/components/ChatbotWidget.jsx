import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PremiumAsset } from './PremiumAsset';
import { MessageSquare, X, Send, Sparkles, RefreshCw, User, ShoppingCart, Info, RotateCcw } from 'lucide-react';

export const ChatbotWidget = () => {
  const {
    chatOpen,
    setChatOpen,
    chatMessages,
    currentAgent,
    isTyping,
    handleUserSendMessage,
    resetChat,
    addToCart,
    triggerConfetti
  } = useApp();

  const [inputMsg, setInputMsg] = useState("");
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isTyping, chatOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    handleUserSendMessage(inputMsg);
    setInputMsg("");
  };

  const handleSuggestionClick = (suggestion) => {
    handleUserSendMessage(suggestion);
  };

  // Render markdown-like list formatting (bold, lists)
  const renderTextContent = (text) => {
    return text.split('\n').map((line, idx) => {
      // Bold parser
      let cleanLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const matches = [...cleanLine.matchAll(boldRegex)];
      
      let nodes = [];
      let lastIndex = 0;

      if (matches.length > 0) {
        matches.forEach((match, mIdx) => {
          const index = match.index;
          // Push preceding text
          if (index > lastIndex) {
            nodes.push(cleanLine.substring(lastIndex, index));
          }
          // Push bold node
          nodes.push(<strong key={`b-${idx}-${mIdx}`} style={{ color: 'var(--text-main)' }}>{match[1]}</strong>);
          lastIndex = index + match[0].length;
        });
        if (lastIndex < cleanLine.length) {
          nodes.push(cleanLine.substring(lastIndex));
        }
      } else {
        nodes = [cleanLine];
      }

      // Check if bullet point
      if (cleanLine.trim().startsWith('* ')) {
        const content = cleanLine.replace(/^\*\s+/, "");
        return (
          <li key={idx} style={{ marginLeft: '16px', listStyleType: 'disc', marginTop: '2px' }}>
            {nodes.length > 0 ? nodes : content}
          </li>
        );
      }

      return <p key={idx} style={{ minHeight: '18px', marginTop: '4px' }}>{nodes}</p>;
    });
  };

  // Render rich custom payload templates based on type
  const renderCustomData = (msg) => {
    const { type, customData } = msg;

    switch (type) {
      case 'product_list':
        return (
          <div className="chat-product-list">
            {customData.map(product => (
              <div key={product.id} className="chat-product-card">
                {/* Mini Visual */}
                <div style={{ width: '40px', height: '40px', background: 'var(--bg-dark)', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <PremiumAsset type={product.iconName} color={product.color} />
                  )}
                </div>
                
                {/* Meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: '0.8rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {product.name}
                  </h5>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{product.price.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '8px' }}>★ {product.rating}</span>
                </div>

                {/* Quick Add */}
                {product.stock > 0 ? (
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      addToCart(product.id, 1);
                      triggerConfetti(0.1);
                    }}
                    style={{ padding: '6px', borderRadius: '6px' }}
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="badge badge-out-stock" style={{ fontSize: '0.65rem', padding: '2px 4px' }}>Sold Out</span>
                )}
              </div>
            ))}
          </div>
        );

      case 'comparison_table':
        return (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table className="chat-comparison-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Specs</th>
                </tr>
              </thead>
              <tbody>
                {customData.map(prod => (
                  <tr key={prod.id}>
                    <td style={{ fontWeight: 600 }}>{prod.name.split(" ")[0]}</td>
                    <td>₹{prod.price.toLocaleString('en-IN')}</td>
                    <td style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {Object.entries(prod.specs).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'order_tracker':
        const stages = ["Order Placed", "Processing", "In Transit", "Delivered"];
        const curStageIdx = stages.indexOf(customData.status);
        const stagePercentage = curStageIdx === -1 ? 0 : (curStageIdx / (stages.length - 1)) * 100;

        return (
          <div className="tracking-visualizer" style={{ padding: '12px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
              <span>Order ID: {customData.id}</span>
              <span style={{ color: 'var(--primary)' }}>{customData.status}</span>
            </div>
            
            {/* Stage Bar */}
            <div className="tracker-steps" style={{ margin: '15px 0' }}>
              <div className="tracker-step-line-active" style={{ width: `${stagePercentage}%`, top: '8px' }} />
              {stages.map((stg, idx) => (
                <div key={stg} style={{ position: 'relative', width: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div 
                    className="tracker-node" 
                    style={{
                      width: '16px',
                      height: '16px',
                      fontSize: '0.55rem',
                      borderColor: curStageIdx >= idx ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                      background: curStageIdx >= idx ? 'var(--primary)' : 'var(--bg-deep)'
                    }}
                  >
                    {curStageIdx >= idx ? '✓' : idx + 1}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '8px' }}>
              <span>Carrier: {customData.shipping.carrier}</span>
              <span>Tracking: {customData.shipping.tracking}</span>
            </div>
          </div>
        );

      case 'order_list':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
            {customData.map(order => (
              <button 
                key={order.id} 
                className="btn-secondary" 
                onClick={() => handleSuggestionClick(`Track order ${order.id}`)}
                style={{ fontSize: '0.8rem', padding: '6px 12px', justifyContent: 'space-between' }}
              >
                <span>📦 Order #{order.id} ({order.date})</span>
                <span style={{ fontWeight: 'bold' }}>Track</span>
              </button>
            ))}
          </div>
        );

      case 'return_eligible_list':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
            {customData.map(order => (
              <button 
                key={order.id} 
                className="btn-secondary" 
                onClick={() => handleSuggestionClick(`Return order ${order.id}`)}
                style={{ fontSize: '0.8rem', padding: '6px 12px', justifyContent: 'space-between', border: '1px solid rgba(168, 85, 247, 0.2)' }}
              >
                <span>📦 Delivered #{order.id} - ₹{order.total.toLocaleString('en-IN')}</span>
                <span style={{ color: '#A855F7', fontWeight: 'bold' }}>Return</span>
              </button>
            ))}
          </div>
        );

      case 'return_confirmation':
        return (
          <div className="glass-panel" style={{ padding: '12px', marginTop: '8px', background: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Items: {customData.order.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-primary" 
                onClick={() => handleSuggestionClick(`confirm_return_${customData.orderId}`)}
                style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', fontSize: '0.8rem', padding: '6px 12px' }}
              >
                Confirm Return
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => handleSuggestionClick("dismiss return request")}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Suggested tags to click
  const suggestionChips = [
    "Wireless earbuds under $50",
    "Where is order ORD-1002?",
    "Apply coupon SAVE10",
    "Compare shoes and boots",
    "Connect to human support"
  ];

  return (
    <div className="chat-widget-container">
      {/* 1. Chat Trigger Button */}
      {!chatOpen && (
        <button className="chat-bubble-trigger animate-bounce" onClick={() => setChatOpen(true)}>
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* 2. Main Chat Panel Drawer */}
      {chatOpen && (
        <div className="glass-panel chat-panel" style={{ border: '1px solid var(--border-active)' }}>
          {/* Header */}
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: currentAgent.isHuman ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'linear-gradient(135deg, #6366f1, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {currentAgent.avatar}
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{currentAgent.name}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></span>
                  {currentAgent.isHuman ? 'Support Lead Online' : 'AI Assistant Live'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Reset chat button */}
              <button 
                className="compare-remove-btn" 
                onClick={resetChat} 
                title="Restart conversation"
                style={{ position: 'static', color: 'var(--text-dim)' }}
              >
                <RefreshCw className="w-4 h-4 hover:text-indigo-400" />
              </button>
              {/* Close panel */}
              <button 
                className="compare-remove-btn" 
                onClick={() => setChatOpen(false)}
                style={{ position: 'static' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Logs Area */}
          <div className="chat-messages">
            {chatMessages.map(msg => (
              <div 
                key={msg.id} 
                className={`msg-bubble ${msg.sender === 'bot' ? 'msg-bot' : 'msg-user'}`}
              >
                {/* Bubble Text */}
                <div style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>
                  {msg.sender === 'bot' ? renderTextContent(msg.text) : msg.text}
                </div>

                {/* Custom rich rendering components */}
                {msg.sender === 'bot' && renderCustomData(msg)}

                {/* Timestamp */}
                <span style={{ 
                  display: 'block', 
                  fontSize: '0.65rem', 
                  color: msg.sender === 'bot' ? 'var(--text-dim)' : 'rgba(255,255,255,0.7)', 
                  textAlign: 'right', 
                  marginTop: '6px' 
                }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Bouncing Typing Indicator */}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips Panel */}
          <div style={{ 
            padding: '8px 12px', 
            background: 'rgba(0,0,0,0.2)', 
            borderTop: '1px solid var(--border-glass)', 
            display: 'flex', 
            gap: '6px', 
            overflowX: 'auto', 
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap'
          }}>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(chip)}
                className="btn-secondary"
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-glow)',
                  flexShrink: 0,
                  background: 'rgba(99, 102, 241, 0.02)'
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Form Input Area */}
          <form onSubmit={handleSubmit} className="chat-input-area">
            <input 
              type="text" 
              className="input-glass" 
              placeholder="Ask ShopAssist AI anything..." 
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem' }}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ padding: '10px', borderRadius: '10px', boxShadow: 'none' }}
              disabled={!inputMsg.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
