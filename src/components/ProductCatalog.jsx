import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PremiumAsset } from './PremiumAsset';
import { Search, SlidersHorizontal, Eye, ShoppingCart, Star, Sparkles, X } from 'lucide-react';

export const ProductCatalog = () => {
  const {
    products,
    addToCart,
    selectedProductForComparison,
    toggleComparison,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    priceRange,
    setPriceRange,
    setChatOpen,
    handleUserSendMessage
  } = useApp();

  const [activeDetailProduct, setActiveDetailProduct] = useState(null);

  // Filters calculation
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "All" || p.subCategory === categoryFilter;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleAskAIAlternative = (prodName) => {
    setChatOpen(true);
    handleUserSendMessage(`What is an alternative to the out of stock ${prodName}?`);
  };

  return (
    <div className="store-grid">
      {/* 1. FILTERS SIDEBAR */}
      <aside className="glass-panel filters-sidebar" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem' }}>Filters</h3>
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Search Products</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input-glass w-full" 
              placeholder="e.g. Earbuds, boots..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px' }}
            />
            <Search className="w-4 h-4 text-text-dim" style={{ position: 'absolute', left: '14px', top: '15px', color: 'var(--text-dim)' }} />
          </div>
        </div>

        {/* Category Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Category</label>
          {['All', 'Audio', 'Wearables', 'Keyboards & Mice', 'Smart Home', 'Power & Cables'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className="btn-secondary"
              style={{
                justifyContent: 'flex-start',
                background: categoryFilter === cat ? 'var(--primary-glow)' : 'transparent',
                borderColor: categoryFilter === cat ? 'var(--primary)' : 'var(--border-glass)',
                color: categoryFilter === cat ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Max Price</span>
            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{priceRange[1]}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="20000" 
            step="500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
            style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <span>₹0</span>
            <span>₹20,000</span>
          </div>
        </div>

        {/* Reset Button */}
        <button 
          className="btn-secondary" 
          onClick={() => {
            setSearchQuery("");
            setCategoryFilter("All");
            setPriceRange([0, 20000]);
          }}
          style={{ marginTop: '10px' }}
        >
          Reset Filters
        </button>
      </aside>

      {/* 2. PRODUCT GRID SECTION */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Showing <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{filteredProducts.length}</span> products
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>No products match your active search filters.</p>
            <button className="btn-primary" onClick={() => setSearchQuery("")}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => {
              const isComparing = selectedProductForComparison.some(p => p.id === product.id);
              const outOfStock = product.stock === 0;

              return (
                <div key={product.id} className="glass-panel product-card" style={{ padding: '16px' }}>
                  {/* Compare Checkbox */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={isComparing} 
                        onChange={() => toggleComparison(product)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      Compare
                    </label>
                    <span className="badge badge-category">{product.subCategory}</span>
                  </div>

                  {/* Render Premium Vector Art */}
                  <div className="product-image-container" onClick={() => setActiveDetailProduct(product)} style={{ cursor: 'pointer' }}>
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                    ) : (
                      <PremiumAsset type={product.iconName} color={product.color} />
                    )}
                  </div>

                  {/* Product Title */}
                  <h4 
                    onClick={() => setActiveDetailProduct(product)}
                    style={{ fontSize: '1.05rem', fontWeight: 600, cursor: 'pointer', marginBottom: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    {product.name}
                  </h4>

                  {/* Ratings */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{product.rating}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>({product.reviews} reviews)</span>
                  </div>

                  {/* Pricing and Stock details */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>₹{product.price.toLocaleString('en-IN')}</span>
                        {product.originalPrice && (
                          <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-dim)' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <div style={{ marginTop: '2px' }}>
                        {outOfStock ? (
                          <span className="badge badge-out-stock">Out of Stock</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: product.stock < 10 ? 'var(--accent)' : 'var(--text-dim)' }}>
                            {product.stock} items left
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        className="btn-secondary" 
                        onClick={() => setActiveDetailProduct(product)} 
                        title="View Details"
                        style={{ padding: '8px' }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {!outOfStock ? (
                        <button 
                          className="btn-primary" 
                          onClick={() => addToCart(product.id, 1)}
                          style={{ padding: '8px 12px' }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          className="btn-secondary" 
                          onClick={() => handleAskAIAlternative(product.name)}
                          title="Ask AI for Alternative"
                          style={{ padding: '8px', border: '1px dashed var(--border-glow)' }}
                        >
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 3. PRODUCT DETAIL MODAL */}
      {activeDetailProduct && (
        <div className="drawer-backdrop" onClick={() => setActiveDetailProduct(null)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div 
            className="glass-panel-glow" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              width: '600px', 
              maxWidth: '90vw', 
              maxHeight: '85vh', 
              overflowY: 'auto', 
              borderRadius: '20px', 
              padding: '30px', 
              position: 'relative',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            {/* Close */}
            <button 
              className="compare-remove-btn" 
              onClick={() => setActiveDetailProduct(null)}
              style={{ top: '20px', right: '20px', fontSize: '1.5rem' }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Layout */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ width: '150px', height: '150px', background: 'var(--bg-deep)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activeDetailProduct.image ? (
                  <img src={activeDetailProduct.image} alt={activeDetailProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <PremiumAsset type={activeDetailProduct.iconName} color={activeDetailProduct.color} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="badge badge-category" style={{ width: 'fit-content', marginBottom: '6px' }}>{activeDetailProduct.subCategory}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.6rem', marginBottom: '6px' }}>{activeDetailProduct.name}</h2>
                
                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{activeDetailProduct.rating}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>({activeDetailProduct.reviews} verified buyer reviews)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{activeDetailProduct.price.toLocaleString('en-IN')}</span>
                  {activeDetailProduct.originalPrice && (
                    <span style={{ fontSize: '1rem', textDecoration: 'line-through', color: 'var(--text-dim)' }}>₹{activeDetailProduct.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: 'var(--text-muted)', marginBottom: '6px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Description</h5>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{activeDetailProduct.description}</p>
            </div>

            {/* Key Features */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Key Features</h5>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
                {activeDetailProduct.features.map((feat, idx) => (
                  <li key={idx} style={{ color: 'var(--text-main)' }}>{feat}</li>
                ))}
              </ul>
            </div>

            {/* Technical Specifications */}
            <div style={{ marginBottom: '25px' }}>
              <h5 style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Technical Specifications</h5>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <tbody>
                  {Object.entries(activeDetailProduct.specs).map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '8px 0', color: 'var(--text-muted)', fontWeight: 500 }}>{key}</td>
                      <td style={{ padding: '8px 0', color: 'var(--text-main)', textAlign: 'right' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid var(--border-glass)' }}>
              <div>
                {activeDetailProduct.stock === 0 ? (
                  <span className="badge badge-out-stock">Out of Stock</span>
                ) : (
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Inventory Status: <strong style={{ color: 'var(--success)' }}>{activeDetailProduct.stock} Available</strong>
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {activeDetailProduct.stock > 0 ? (
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      addToCart(activeDetailProduct.id, 1);
                      setActiveDetailProduct(null);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                ) : (
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      setActiveDetailProduct(null);
                      handleAskAIAlternative(activeDetailProduct.name);
                    }}
                  >
                    <Sparkles className="w-4 h-4" /> Search Alternatives
                  </button>
                )}
                <button className="btn-secondary" onClick={() => setActiveDetailProduct(null)}>Close</button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
