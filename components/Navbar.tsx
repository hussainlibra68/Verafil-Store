/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BRAND_NAME } from '../constants';
import { Product } from '../types';
import TopSearchBar from './TopSearchBar';

interface NavbarProps {
  currentView: string;
  onNavigate: (viewType: 'home' | 'shop' | 'about' | 'contact' | 'admin', targetId?: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
  onSearchSubmit: (query: string) => void;
  products?: Product[];
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentView,
  onNavigate, 
  cartCount, 
  onOpenCart,
  onSelectProduct,
  onSearchSubmit,
  products
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLink = (viewType: 'home' | 'shop' | 'about' | 'contact' | 'admin', targetId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(viewType, targetId);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onOpenCart();
  };

  // Determine text color based on state
  const isLightText = currentView === 'home' && !scrolled && !mobileMenuOpen;
  const textColorClass = isLightText ? 'text-[#F5F2EB]' : 'text-[#2C2A26]';
  const navBgClass = (scrolled || mobileMenuOpen || currentView !== 'home')
    ? 'bg-[#F5F2EB]/95 backdrop-blur-md py-3.5 shadow-xs border-b border-[#D6D1C7]/50' 
    : 'bg-transparent py-6';

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${navBgClass}`}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => handleLink('home')}
              className={`text-2xl sm:text-3xl font-serif font-medium tracking-tight text-left transition-colors duration-300 ${textColorClass} cursor-pointer focus:outline-none`}
            >
              {BRAND_NAME}
            </button>
          </div>

          {/* Center: Searchbar at Top (Desktop & Tablet) */}
          <div className="hidden lg:flex flex-1 justify-center max-w-md mx-4">
            <TopSearchBar 
              products={products}
              onSelectProduct={onSelectProduct}
              onSearchSubmit={onSearchSubmit}
              isScrolled={scrolled || currentView !== 'home'}
            />
          </div>
          
          {/* Center-Right Links: Desktop */}
          <div className={`hidden md:flex items-center gap-8 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 ${textColorClass}`}>
            <button 
              onClick={() => handleLink('home')}
              className={`hover:opacity-60 transition-opacity cursor-pointer pb-0.5 border-b ${
                currentView === 'home' ? 'border-current' : 'border-transparent'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => handleLink('shop')}
              className={`hover:opacity-60 transition-opacity cursor-pointer pb-0.5 border-b ${
                currentView === 'shop' ? 'border-current' : 'border-transparent'
              }`}
            >
              Shop
            </button>
            <button 
              onClick={() => handleLink('home', 'shop-by-category')}
              className="hover:opacity-60 transition-opacity cursor-pointer pb-0.5 border-b border-transparent"
            >
              Categories
            </button>
            <button 
              onClick={() => handleLink('about')}
              className={`hover:opacity-60 transition-opacity cursor-pointer pb-0.5 border-b ${
                currentView === 'about' ? 'border-current' : 'border-transparent'
              }`}
            >
              About
            </button>
            <button 
              onClick={() => handleLink('contact')}
              className={`hover:opacity-60 transition-opacity cursor-pointer pb-0.5 border-b ${
                currentView === 'contact' ? 'border-current' : 'border-transparent'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Right Actions */}
          <div className={`flex items-center gap-3 sm:gap-4 transition-colors duration-300 ${textColorClass}`}>
            
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden p-1.5 focus:outline-none opacity-80 hover:opacity-100"
              aria-label="Toggle mobile search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Button */}
            <button 
              onClick={handleCartClick}
              className="text-xs sm:text-sm font-semibold uppercase tracking-widest hover:opacity-60 transition-opacity px-3 py-1.5 rounded-full border border-current"
            >
              Cart ({cartCount})
            </button>
            
            {/* Mobile Menu Hamburger */}
            <button 
              className={`block md:hidden focus:outline-none p-1 transition-colors duration-300 ${textColorClass}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
               {mobileMenuOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                 </svg>
               )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-6 pt-3 pb-2 border-t border-[#D6D1C7]/60 mt-3 animate-fadeIn">
            <TopSearchBar 
              products={products}
              onSelectProduct={(p) => {
                setMobileSearchOpen(false);
                onSelectProduct(p);
              }}
              onSearchSubmit={(q) => {
                setMobileSearchOpen(false);
                onSearchSubmit(q);
              }}
              isScrolled={true}
            />
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#F5F2EB] flex flex-col justify-center px-8 md:hidden">
          <div className="flex flex-col gap-6 text-xl font-serif text-[#2C2A26]">
            <button 
              onClick={() => handleLink('home')}
              className="text-left py-2 border-b border-[#D6D1C7]/50"
            >
              Home
            </button>
            <button 
              onClick={() => handleLink('shop')}
              className="text-left py-2 border-b border-[#D6D1C7]/50"
            >
              Shop All Products
            </button>
            <button 
              onClick={() => handleLink('home', 'shop-by-category')}
              className="text-left py-2 border-b border-[#D6D1C7]/50"
            >
              Categories
            </button>
            <button 
              onClick={() => handleLink('about')}
              className="text-left py-2 border-b border-[#D6D1C7]/50"
            >
              About Maison
            </button>
            <button 
              onClick={() => handleLink('contact')}
              className="text-left py-2 border-b border-[#D6D1C7]/50"
            >
              Contact & Concierge
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
