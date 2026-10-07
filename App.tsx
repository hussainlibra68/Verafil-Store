/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ShopByCategory from './components/ShopByCategory';
import ProductGrid from './components/ProductGrid';
import ShopPage from './components/ShopPage';
import About from './components/About';
import Contact from './components/Contact';
import Assistant from './components/Assistant';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import AdminAuthModal from './components/AdminAuthModal';
import { Product, ViewState, ProductCategory, Order } from './types';
import { PRODUCTS } from './constants';
import { api } from './src/services/api';

function App() {
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isInitialLoaded, setIsInitialLoaded] = useState(false);

  // Hidden Admin Dashboard Authentication state (Master Password: 123321)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('verafil_admin_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Fetch live products from Cloud SQL
  const loadProducts = useCallback(async () => {
    try {
      const data = await api.getProducts();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
        return data;
      }
    } catch (err) {
      console.warn('API getProducts fallback to initial catalog:', err);
    }
    return products;
  }, [products]);

  // Initial load & URL routing for Sharable Links and Dashboard
  useEffect(() => {
    const initApp = async () => {
      const liveList = await loadProducts();
      const currentList = (liveList && liveList.length > 0) ? liveList : products;

      // Check URL query parameters or hash for direct link
      const urlParams = new URLSearchParams(window.location.search);
      const productIdFromQuery = urlParams.get('product') || urlParams.get('productId');
      const viewParam = urlParams.get('view');
      const hash = window.location.hash;

      if (viewParam === 'admin' || hash === '#admin') {
        const authed = sessionStorage.getItem('verafil_admin_unlocked') === 'true';
        if (authed) {
          setView({ type: 'admin' });
        } else {
          setIsAuthModalOpen(true);
        }
      } else if (productIdFromQuery) {
        const found = currentList.find(p => p.id === productIdFromQuery);
        if (found) {
          setView({ type: 'product', product: found });
        } else {
          // Attempt to fetch specific product from API
          api.getProduct(productIdFromQuery)
            .then(p => setView({ type: 'product', product: p }))
            .catch(() => {});
        }
      } else if (hash && hash.startsWith('#product-')) {
        const id = hash.replace('#product-', '');
        const found = currentList.find(p => p.id === id);
        if (found) {
          setView({ type: 'product', product: found });
        }
      }
      setIsInitialLoaded(true);
    };

    initApp();

    // Handle browser popstate / back button
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const prodId = urlParams.get('product') || urlParams.get('productId');
      const viewParam = urlParams.get('view');
      const hash = window.location.hash;

      if (viewParam === 'admin' || hash === '#admin') {
        const authed = sessionStorage.getItem('verafil_admin_unlocked') === 'true';
        if (authed) {
          setView({ type: 'admin' });
        } else {
          setIsAuthModalOpen(true);
        }
      } else if (prodId) {
        const found = products.find(p => p.id === prodId);
        if (found) setView({ type: 'product', product: found });
      } else if (hash && hash.startsWith('#product-')) {
        const id = hash.replace('#product-', '');
        const found = products.find(p => p.id === id);
        if (found) setView({ type: 'product', product: found });
      } else if (!hash || hash === '#') {
        setView({ type: 'home' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut listener: Ctrl+Shift+A or Cmd+Shift+A to trigger admin portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const authed = sessionStorage.getItem('verafil_admin_unlocked') === 'true';
        if (authed) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setView({ type: 'admin' });
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Multi-page navigation handler
  const handleNavigate = (viewType: 'home' | 'shop' | 'about' | 'contact' | 'admin', targetId?: string) => {
    if (viewType === 'admin') {
      const authed = isAdminUnlocked || sessionStorage.getItem('verafil_admin_unlocked') === 'true';
      if (!authed) {
        setIsAuthModalOpen(true);
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setView({ type: 'admin' });
      try {
        window.history.pushState(null, '', '?view=admin#admin');
      } catch (e) {}
      return;
    }

    if (viewType === 'shop') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setView({ 
        type: 'shop', 
        selectedCategory: targetId || 'All', 
        searchQuery: '' 
      });
      try {
        window.history.pushState(null, '', '?view=shop');
      } catch (e) {}
      return;
    }

    if (viewType === 'about') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setView({ type: 'about' });
      try {
        window.history.pushState(null, '', '?view=about');
      } catch (e) {}
      return;
    }

    if (viewType === 'contact') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setView({ type: 'contact' });
      try {
        window.history.pushState(null, '', '?view=contact');
      } catch (e) {}
      return;
    }

    // Home view
    if (view.type !== 'home') {
      setView({ type: 'home' });
      try {
        window.history.pushState(null, '', window.location.pathname);
      } catch (e) {}
      if (targetId) {
        setTimeout(() => scrollToSection(targetId), 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (targetId) {
        scrollToSection(targetId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const scrollToSection = (targetId: string) => {
    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      try {
        window.history.pushState(null, '', `#${targetId}`);
      } catch (err) {
        // Ignore SecurityError in restricted environments
      }
    }
  };

  // Top Search submission handler -> opens dedicated Shop page with search
  const handleSearchSubmit = (query: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView({ 
      type: 'shop', 
      selectedCategory: 'All', 
      searchQuery: query 
    });
  };

  // Direct product selection from Top Searchbar, Grid, or Dashboard
  const handleSelectProduct = (product: Product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView({ type: 'product', product });
    try {
      window.history.pushState(null, '', `?product=${product.id}#product-${product.id}`);
    } catch (e) {}
  };

  const handleSelectCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView({ 
      type: 'shop', 
      selectedCategory: category, 
      searchQuery: '' 
    });
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => [...prev, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCartItems(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleOrderSuccess = (order: Order) => {
    // Clear cart once order is recorded in Cloud SQL
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] font-sans text-[#2C2A26] selection:bg-[#D6D1C7] selection:text-[#2C2A26]">
      {view.type !== 'checkout' && (
        <Navbar 
          currentView={view.type}
          onNavigate={handleNavigate}
          cartCount={cartItems.length}
          onOpenCart={() => setIsCartOpen(true)}
          onSelectProduct={handleSelectProduct}
          onSearchSubmit={handleSearchSubmit}
          products={products}
        />
      )}
      
      <main>
        {/* Page 1: Home View with Curated Selection, Categories, and About preview */}
        {view.type === 'home' && (
          <>
            <Hero />

            {/* Shop by Category */}
            <ShopByCategory
              activeCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Featured Products on Homepage (with explore full catalog CTA) */}
            <ProductGrid 
              products={products}
              activeCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onProductClick={handleSelectProduct}
              onViewAllProducts={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'shop', selectedCategory: 'All' });
              }}
              limit={6}
            />

            {/* About preview with Phone number & Premium Standards */}
            <About 
              isFullPage={false} 
              onExploreShop={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'shop', selectedCategory: 'All' });
              }} 
            />
          </>
        )}

        {/* Page 2: Dedicated Full Shop Page with Cloud SQL Products */}
        {view.type === 'shop' && (
          <ShopPage 
            products={products}
            initialCategory={view.selectedCategory || 'All'}
            initialSearchQuery={view.searchQuery || ''}
            onProductClick={handleSelectProduct}
          />
        )}

        {/* Page 3: Dedicated Full About Page */}
        {view.type === 'about' && (
          <About 
            isFullPage={true} 
            onExploreShop={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'shop', selectedCategory: 'All' });
            }} 
          />
        )}

        {/* Page 4: Dedicated Full Contact Page */}
        {view.type === 'contact' && (
          <Contact />
        )}

        {/* Page 5: Product Detail View (with multiple images, videos, and sharable link) */}
        {view.type === 'product' && (
          <ProductDetail 
            product={view.product} 
            onBack={() => {
              setView({ type: 'home' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={addToCart}
          />
        )}

        {/* Page 6: Functional Checkout (records orders permanently to Cloud SQL) */}
        {view.type === 'checkout' && (
          <Checkout 
            items={cartItems}
            onBack={() => {
              setView({ type: 'home' });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {/* Page 7: Separate Management Dashboard (Cloud SQL persistent products & orders) */}
        {view.type === 'admin' && (
          <AdminDashboard
            products={products}
            onProductsChange={loadProducts}
            onNavigateHome={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'home' });
            }}
            onViewProduct={handleSelectProduct}
            onLockDashboard={() => {
              try {
                sessionStorage.removeItem('verafil_admin_unlocked');
              } catch (e) {}
              setIsAdminUnlocked(false);
              setView({ type: 'home' });
              try {
                window.history.pushState(null, '', window.location.pathname);
              } catch (e) {}
            }}
          />
        )}
      </main>

      {/* Footer with page links and support info */}
      {view.type !== 'checkout' && view.type !== 'admin' && (
        <Footer 
          onNavigate={handleNavigate} 
          onOpenSecretAdmin={() => {
            if (isAdminUnlocked) {
              handleNavigate('admin');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
        />
      )}
      
      {/* WhatsApp Button: Basic, plain, and placed in corner */}
      <WhatsAppButton />
      
      {/* Multilingual AI Concierge Assistant */}
      <Assistant />
      
      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setView({ type: 'checkout' });
        }}
      />

      {/* Hidden Master Password Auth Modal for Admin Management Dashboard */}
      <AdminAuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          if (view.type === 'admin') {
            setView({ type: 'home' });
            try {
              window.history.pushState(null, '', window.location.pathname);
            } catch (e) {}
          }
        }}
        onSuccess={() => {
          setIsAdminUnlocked(true);
          setIsAuthModalOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setView({ type: 'admin' });
          try {
            window.history.pushState(null, '', '?view=admin#admin');
          } catch (e) {}
        }}
      />
    </div>
  );
}

export default App;
