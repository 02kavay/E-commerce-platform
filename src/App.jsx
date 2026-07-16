import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductComparison } from './components/ProductComparison';
import { OrderTracker } from './components/OrderTracker';
import { CartDrawer } from './components/CartDrawer';
import { ChatbotWidget } from './components/ChatbotWidget';

const AppContent = () => {
  const { activeTab } = useApp();

  return (
    <div className="app-container">
      {/* Global Navigation Bar */}
      <Header />

      {/* Main Workspace Frame */}
      <main className="main-content">
        {activeTab === 'catalog' && <ProductCatalog />}
        {activeTab === 'compare' && <ProductComparison />}
        {activeTab === 'orders' && <OrderTracker />}
      </main>

      {/* Slide-out Shopping Cart */}
      <CartDrawer />

      {/* Floating AI Assistant Widget */}
      <ChatbotWidget />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
