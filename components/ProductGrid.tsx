/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products?: Product[];
  onProductClick: (product: Product) => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  onViewAllProducts?: () => void;
  limit?: number;
}

const DEFAULT_CATEGORIES = ['All', 'Fashion', 'Electronics', 'Home & Kitchen', 'Skincare', 'Eye Care'];

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products = PRODUCTS,
  onProductClick, 
  activeCategory: controlledCategory,
  onCategoryChange,
  onViewAllProducts,
  limit
}) => {
  const [internalCategory, setInternalCategory] = useState('All');
  const activeCategory = controlledCategory !== undefined ? controlledCategory : internalCategory;

  const handleCategoryClick = (cat: string) => {
    if (onCategoryChange) {
      onCategoryChange(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  // Derive categories dynamically from existing products + defaults
  const categories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    products.forEach(p => { if (p.category) set.add(p.category); });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);
    if (limit && limit > 0) {
      return list.slice(0, limit);
    }
    return list;
  }, [products, activeCategory, limit]);

  return (
    <section id="products" className="py-24 md:py-32 px-6 md:px-12 bg-[#F5F2EB]">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col items-center text-center mb-20 space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C8881]">
            Curated Highlights
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-[#2C2A26]">Featured Collection</h2>
          <p className="text-sm md:text-base text-[#5D5A53] max-w-lg font-light leading-relaxed">
            A preview of our top-class standard creations. Crafted for sensory stillness and timeless luxury.
          </p>
          
          {/* Minimal Filter */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-4 border-t border-[#D6D1C7]/50 w-full max-w-2xl">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`text-xs sm:text-sm uppercase tracking-widest pb-1 border-b transition-all duration-300 cursor-pointer ${
                  activeCategory === cat 
                    ? 'border-[#2C2A26] text-[#2C2A26] font-semibold' 
                    : 'border-transparent text-[#A8A29E] hover:text-[#2C2A26]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Large Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={onProductClick} />
          ))}
        </div>

        {/* Explore All CTA for Homepage */}
        {onViewAllProducts && (
          <div className="mt-24 text-center">
            <button
              onClick={onViewAllProducts}
              className="px-10 py-4 bg-[#2C2A26] text-[#F5F2EB] rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-black hover:shadow-xl transition-all inline-flex items-center gap-3 cursor-pointer"
            >
              <span>Explore All Products ({products.length})</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
