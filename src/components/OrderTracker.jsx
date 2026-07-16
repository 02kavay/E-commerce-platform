import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Truck, Calendar, ShoppingBag, RotateCcw, AlertTriangle, X } from 'lucide-react';

export const OrderTracker = () => {
  const { 
    orders, 
    cancelOrder, 
    returnOrder,
    triggerConfetti 
  } = useApp();

  const [orderQuery, setOrderQuery] = useState("");
  const [returnConfirmId, setReturnConfirmId] = useState(null);
  const [returnReason, setReturnReason] = useState("Doesn't fit");
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(orderQuery.toLowerCase()) ||
    o.items.some(item => item.name.toLowerCase().includes(orderQuery.toLowerCase()))
  );

  const handleReturnAction = (orderId) => {
    const res = returnOrder(orderId, returnReason);
    if (res.success) {
      setReturnConfirmId(null);
      triggerConfetti(0.2);
    }
  };

  const handleCancelAction = (orderId) => {
    const res = cancelOrder(orderId);
    if (res.success) {
      setCancelConfirmId(null);
      triggerConfetti(0.2);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'var(--success)';
      case 'In Transit': return 'var(--accent)';
      case 'Processing': return 'var(--primary)';
      case 'Cancelled': return 'var(--error)';
      case 'Returned': return '#A855F7';
      default: return 'var(--text-muted)';
    }
  };

  const getStagePercentage = (status) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Processing': return 33;
      case 'In Transit': return 66;
      case 'Delivered': return 100;
      default: return 0;
    }
  };

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Tracker Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem' }}>Order History & Live Tracking</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Review shipping progress, process exchanges, or cancel active orders.</p>
        </div>

        {/* Search Order bar */}
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <input 
            type="text" 
            className="input-glass w-full" 
            placeholder="Search Order ID (e.g. ORD-1002)..."
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', height: '42px' }}
          />
          <Search className="w-4 h-4 text-text-dim" style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-dim)' }} />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No orders found matching your search.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredOrders.map(order => {
            const isCancelled = order.status === "Cancelled";
            const isReturned = order.status === "Returned";
            const isDelivered = order.status === "Delivered";
            
            // Map stages for active tracker
            const stages = ["Order Placed", "Processing", "In Transit", "Delivered"];
            const currentStageIndex = stages.indexOf(order.status);
            const isFinishedState = isCancelled || isReturned;

            return (
              <div key={order.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. Order Card Header Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '15px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Order #{order.id}
                      <span 
                        className="badge" 
                        style={{ 
                          background: `rgba(255,255,255,0.03)`, 
                          border: `1px solid ${getStatusColor(order.status)}`, 
                          color: getStatusColor(order.status),
                          fontSize: '0.75rem' 
                        }}
                      >
                        {order.status}
                      </span>
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      Placed on: {order.date}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order Total:</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>₹{order.total.toLocaleString('en-IN')}</h3>
                  </div>
                </div>

                {/* 2. Products List inside Order */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                  
                  {/* Left Column: items & shipping details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <h5 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Items Purchased</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', background: 'rgba(0,0,0,0.1)', padding: '8px 12px', borderRadius: '6px' }}>
                            <span style={{ fontWeight: 500 }}>{item.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>x{item.quantity}</span></span>
                            <span style={{ color: 'var(--text-muted)' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping address details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '5px' }}>
                      <div>
                        <h5 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>Shipping Destination</h5>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{order.shipping.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.shipping.address}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.shipping.city}, {order.shipping.zip}</p>
                      </div>
                      <div>
                        <h5 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>Carrier Logistics</h5>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{order.shipping.carrier}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tracking ID: {order.shipping.tracking}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Visual Tracker or cancel confirmation modals */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    
                    {!isFinishedState ? (
                      // Stage timeline tracking visualizer
                      <div className="tracking-visualizer" style={{ marginTop: 0 }}>
                        <h5 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
                          Delivery Progress Tracker
                        </h5>
                        <div className="tracker-steps">
                          {/* Active connector bar */}
                          <div 
                            className="tracker-step-line-active" 
                            style={{ 
                              width: `${getStagePercentage(order.status)}%` 
                            }} 
                          />
                          
                          {stages.map((stage, sIdx) => {
                            const isCompleted = currentStageIndex >= sIdx;
                            const isActive = currentStageIndex === sIdx;
                            return (
                              <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '22px' }}>
                                <div className={`tracker-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                  {isCompleted ? '✓' : sIdx + 1}
                                </div>
                                <span style={{
                                  position: 'absolute',
                                  top: '28px',
                                  fontSize: '0.65rem',
                                  color: isActive ? 'var(--text-main)' : 'var(--text-dim)',
                                  fontWeight: isActive ? 700 : 500,
                                  whiteSpace: 'nowrap',
                                  transform: 'translateX(-50%)',
                                  left: '50%'
                                }}>
                                  {stage}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Recent History logs */}
                        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <h6 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tracking History</h6>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '100px', overflowY: 'auto', paddingRight: '4px' }}>
                            {order.timeline.map((log, lIdx) => (
                              <div key={lIdx} style={{ fontSize: '0.75rem', borderLeft: '1px solid var(--border-glass)', paddingLeft: '8px', marginLeft: '4px' }}>
                                <span style={{ color: 'var(--text-dim)' }}>{log.date}</span> — <strong style={{ color: 'var(--text-muted)' }}>{log.status}</strong>
                                <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>{log.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Cancelled or Returned Visual
                      <div className="glass-panel" style={{ padding: '20px', background: 'rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', height: '100%', justifyContent: 'center' }}>
                        <RotateCcw className="w-8 h-8" style={{ color: isReturned ? '#A855F7' : 'var(--error)' }} />
                        <h4 style={{ fontWeight: 600 }}>Order Closed</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                          {isReturned ? 'This order has been returned. A refund was issued to your account.' : 'This order was cancelled before shipping. Refund processed.'}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', borderTop: '1px solid var(--border-glass)', paddingTop: '10px', fontSize: '0.75rem' }}>
                          {order.timeline.map((log, lIdx) => (
                            <div key={lIdx} style={{ color: 'var(--text-dim)' }}>
                              <span>{log.date}</span>: <strong>{log.status}</strong> - {log.desc}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Action Buttons (Cancel / Return forms) */}
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  
                  {/* Active Order actions */}
                  {!isFinishedState && (
                    <>
                      {/* Return Trigger */}
                      {isDelivered && (
                        <div>
                          {returnConfirmId === order.id ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <select 
                                className="input-glass"
                                value={returnReason} 
                                onChange={(e) => setReturnReason(e.target.value)}
                                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                              >
                                <option value="Doesn't fit">Size doesn't fit</option>
                                <option value="Changed mind">Changed mind</option>
                                <option value="Defective">Defective / Damaged</option>
                                <option value="Wrong item received">Wrong item received</option>
                              </select>
                              <button className="btn-primary" onClick={() => handleReturnAction(order.id)} style={{ padding: '8px 15px', fontSize: '0.85rem' }}>
                                Confirm Return & Refund
                              </button>
                              <button className="btn-secondary" onClick={() => setReturnConfirmId(null)} style={{ padding: '8px 15px', fontSize: '0.85rem' }}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button className="btn-secondary" onClick={() => setReturnConfirmId(order.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <RotateCcw className="w-4 h-4 text-purple-400" />
                              Return Delivered Items
                            </button>
                          )}
                        </div>
                      )}

                      {/* Cancel Trigger */}
                      {!isDelivered && (
                        <div>
                          {cancelConfirmId === order.id ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle className="w-4 h-4" /> Are you sure?
                              </span>
                              <button className="btn-primary" onClick={() => handleCancelAction(order.id)} style={{ padding: '8px 15px', fontSize: '0.85rem', background: 'var(--error)' }}>
                                Yes, Cancel Order
                              </button>
                              <button className="btn-secondary" onClick={() => setCancelConfirmId(null)} style={{ padding: '8px 15px', fontSize: '0.85rem' }}>
                                Dismiss
                              </button>
                            </div>
                          ) : (
                            <button className="btn-secondary" onClick={() => setCancelConfirmId(order.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <X className="w-4 h-4 text-red-400" />
                              Cancel Pending Order
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
