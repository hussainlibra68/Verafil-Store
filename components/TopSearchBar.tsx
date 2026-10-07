/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { formatPKR } from '../src/utils/currency';

interface TopSearchBarProps {
  products?: Product[];
  onSelectProduct: (product: Product) => void;
  onSearchSubmit: (query: string) => void;
  isScrolled?: boolean;
}

const TopSearchBar: React.FC<TopSearchBarProps> = ({ 
  products = PRODUCTS,
  onSelectProduct, 
  onSearchSubmit,
  isScrolled = false
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter products live
  const searchResults = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tagline && p.tagline.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
        );
      }).slice(0, 5)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    onSearchSubmit(query.trim());
  };

  const handleSelect = (product: Product) => {
    setIsOpen(false);
    setQuery('');
    onSelectProduct(product);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder="Search products, cashmere, acoustics..."
          className={`w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-full transition-all duration-300 outline-none ${
            isScrolled
              ? 'bg-white/80 focus:bg-white text-[#2C2A26] placeholder-[#8C8881] border border-[#D6D1C7] shadow-xs focus:ring-2 focus:ring-[#2C2A26]/20'
              : 'bg-white/20 backdrop-blur-md focus:bg-white text-[#2C2A26] sm:text-inherit focus:text-[#2C2A26] placeholder-inherit focus:placeholder-[#8C8881] border border-white/30 focus:border-transparent focus:shadow-md'
          }`}
        />
        {/* Search Icon */}
        <span className="absolute left-3 text-inherit pointer-events-none opacity-60">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>

        {/* Clear / Submit icon */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 text-inherit opacity-60 hover:opacity-100"
            aria-label="Clear search"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Live Search Suggestions Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#F5F2EB] rounded-2xl shadow-2xl border border-[#D6D1C7] overflow-hidden z-50 text-[#2C2A26] max-h-96 overflow-y-auto animate-fadeIn">
          {searchResults.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#8C8881] border-b border-[#D6D1C7]/50">
                Products ({searchResults.length})
              </div>
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[#EBE7DE] transition-colors border-b border-[#D6D1C7]/30 last:border-b-0 cursor-pointer"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-11 h-11 object-cover rounded-lg bg-[#E0DCD3] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-[#2C2A26] truncate">
                      {product.name}
                    </p>
                    <p className="text-[11px] text-[#736E65] truncate font-light">
                      {product.category} • {product.tagline}
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-serif font-medium text-[#2C2A26] shrink-0">
                    {formatPKR(product.price)}
                  </span>
                </button>
              ))}

              <button
                onClick={handleSubmit}
                className="w-full py-2.5 px-4 text-center text-xs font-semibold uppercase tracking-wider text-[#2C2A26] bg-[#EBE7DE]/70 hover:bg-[#EBE7DE] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View all results for &ldquo;{query}&rdquo; in Shop</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-[#736E65]">
              <p>No products found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#8C8881] mt-1">Try searching for &quot;Coat&quot;, &quot;Harmony&quot;, &quot;Serum&quot;, or &quot;Coffee&quot;.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopSearchBar;
