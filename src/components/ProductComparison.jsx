import React from 'react';
import { useApp } from '../context/AppContext';
import { PremiumAsset } from './PremiumAsset';
import { ShoppingCart, Trash2, X, AlertCircle } from 'lucide-react';

export const ProductComparison = () => {
  const { 
    selectedProductForComparison, 
    toggleComparison, 
    clearComparison, 
    addToCart,
    setActiveTab
  } = useApp();

  if (selectedProductForComparison.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', marginTop: '1.5rem' }}>
        <AlertCircle className="w-12 h-12 text-indigo-400" style={{ margin: '0 auto 15px' }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, marginBottom: '10px' }}>
          No Products Selected
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 20px', fontSize: '0.95rem' }}>
          Go back to the storefront catalog and check the "Compare" box on up to 3 products to review specifications, ratings, and features side-by-side.
        </p>
        <button className="btn-primary" onClick={() => setActiveTab("catalog")}>
          Browse Storefront
        </button>
      </div>
    );
  }

  // Compile a list of all unique spec keys across selected products
  const allSpecKeys = Array.from(
    new Set(
      selectedProductForComparison.reduce((keys, prod) => {
        return [...keys, ...Object.keys(prod.specs || {})];
      }, [])
    )
  );

  return (
    <div style={{ marginTop: '1.5rem' }}>
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem' }}>Product Comparison</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comparing {selectedProductForComparison.length} of 3 maximum items</p>
        </div>
        <button 
          className="btn-secondary" 
          onClick={clearComparison}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          <Trash2 className="w-4 h-4" />
          Clear Comparison
        </button>
      </div>

      {/* Grid Comparison Matrix */}
      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
              {/* Corner Empty Header */}
              <th style={{ width: '200px', padding: '15px', textAlign: 'left', color: 'var(--text-muted)' }}>Specifications</th>
              
              {/* Product Card Headers */}
              {selectedProductForComparison.map(product => (
                <th key={product.id} style={{ padding: '15px', textAlign: 'center', verticalAlign: 'top', width: `${80 / selectedProductForComparison.length}%` }}>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    
                    {/* Deselect Button */}
                    <button 
                      className="compare-remove-btn" 
                      onClick={() => toggleComparison(product)}
                      style={{ top: '-10px', right: '0' }}
                      title="Remove product"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Small visual */}
                    <div style={{ width: '80px', height: '80px', background: 'var(--bg-deep)', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <PremiumAsset type={product.iconName} color={product.color} />
                      )}
                    </div>

                    {/* Meta */}
                    <span className="badge badge-category" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>{product.subCategory}</span>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{product.name}</h4>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>₹{product.price.toLocaleString('en-IN')}</span>

                    {/* Action */}
                    {product.stock > 0 ? (
                      <button 
                        className="btn-primary" 
                        onClick={() => addToCart(product.id, 1)}
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Buy
                      </button>
                    ) : (
                      <span className="badge badge-out-stock" style={{ fontSize: '0.7rem' }}>Out of Stock</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* 1. Category Row */}
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <td style={{ padding: '12px 15px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Category</td>
              {selectedProductForComparison.map(product => (
                <td key={product.id} style={{ padding: '12px 15px', textTransform: 'uppercase', fontSize: '0.85rem', textAlign: 'center' }}>
                  {product.subCategory}
                </td>
              ))}
            </tr>

            {/* 2. Rating Row */}
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <td style={{ padding: '12px 15px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Customer Rating</td>
              {selectedProductForComparison.map(product => (
                <td key={product.id} style={{ padding: '12px 15px', fontSize: '0.85rem', textAlign: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>★ {product.rating}</span> ({product.reviews} reviews)
                </td>
              ))}
            </tr>

            {/* 3. Dynamic Spec Rows */}
            {allSpecKeys.map(specKey => (
              <tr key={specKey} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '12px 15px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>{specKey}</td>
                {selectedProductForComparison.map(product => (
                  <td key={product.id} style={{ padding: '12px 15px', fontSize: '0.85rem', textAlign: 'center', color: product.specs[specKey] ? 'var(--text-main)' : 'var(--text-dim)' }}>
                    {product.specs[specKey] || '—'}
                  </td>
                ))}
              </tr>
            ))}

            {/* 4. Features list comparison */}
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <td style={{ padding: '12px 15px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem', verticalAlign: 'top' }}>Key Highlights</td>
              {selectedProductForComparison.map(product => (
                <td key={product.id} style={{ padding: '12px 15px', fontSize: '0.8rem', textAlign: 'left', verticalAlign: 'top' }}>
                  <ul style={{ paddingLeft: '14px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {product.features.map((feat, index) => (
                      <li key={index} style={{ color: 'var(--text-muted)' }}>{feat}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* 5. Inventory availability */}
            <tr>
              <td style={{ padding: '12px 15px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Stock Status</td>
              {selectedProductForComparison.map(product => (
                <td key={product.id} style={{ padding: '12px 15px', fontSize: '0.85rem', textAlign: 'center' }}>
                  {product.stock > 0 ? (
                    <span style={{ color: 'var(--success)' }}>In Stock ({product.stock} left)</span>
                  ) : (
                    <span style={{ color: 'var(--error)' }}>Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
