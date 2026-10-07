/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ShopPageProps {
  products?: Product[];
  initialCategory?: string;
  initialSearchQuery?: string;
  onProductClick: (product: Product) => void;
}

const DEFAULT_CATEGORIES = ['All', 'Fashion', 'Electronics', 'Home & Kitchen', 'Skincare', 'Eye Care'];

const ShopPage: React.FC<ShopPageProps> = ({
  products = PRODUCTS,
  initialCategory = 'All',
  initialSearchQuery = '',
  onProductClick
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchFilter, setSearchFilter] = useState<string>(initialSearchQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Derive categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    products.forEach(p => { if (p.category) set.add(p.category); });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }

    // Filter by Search Query
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, activeCategory, searchFilter, sortBy]);

  return (
    <div className="pt-32 pb-32 px-6 md:px-12 bg-[#F5F2EB] text-[#2C2A26] min-h-screen">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#8C8881]">
            Full Catalog &bull; Cloud SQL Database
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-[#2C2A26]">
            The VERAFIL Shop
          </h1>
          <p className="text-sm md:text-base text-[#5D5A53] max-w-xl font-light">
            Explore our complete line of tactile electronics, fine cashmere apparel, ceramics, and restorative botanicals.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-[#EBE7DE] rounded-3xl p-6 mb-16 border border-[#D6D1C7] flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Categories Horizontal Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#2C2A26] text-white shadow-sm'
                    : 'bg-white/60 text-[#5D5A53] hover:bg-white hover:text-[#2C2A26]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-center sm:justify-end">
            {/* Quick in-page Search */}
            <div className="relative min-w-[220px]">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full bg-white/80 border border-[#D6D1C7] rounded-full px-4 py-2 pl-9 text-xs outline-none focus:ring-2 focus:ring-[#2C2A26]/20 text-[#2C2A26]"
              />
              <svg className="w-3.5 h-3.5 absolute left-3.5 top-3 text-[#8C8881]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-2.5 text-xs text-[#8C8881] hover:text-[#2C2A26]"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white/80 border border-[#D6D1C7] rounded-full px-4 py-2 text-xs uppercase tracking-wider text-[#2C2A26] outline-none cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Active Filters */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#D6D1C7]/60 text-xs text-[#736E65]">
          <span>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}
            {activeCategory !== 'All' && <span> in <strong>{activeCategory}</strong></span>}
            {searchFilter && <span> matching &ldquo;{searchFilter}&rdquo;</span>}
          </span>
          {(activeCategory !== 'All' || searchFilter) && (
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchFilter('');
              }}
              className="text-[#2C2A26] font-medium underline uppercase tracking-wider hover:opacity-75"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onClick={onProductClick} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h3 className="text-2xl font-serif text-[#2C2A26] mb-2">No matching products found</h3>
            <p className="text-sm text-[#736E65] mb-6">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchFilter('');
              }}
              className="px-6 py-2.5 bg-[#2C2A26] text-white rounded-full text-xs uppercase tracking-wider"
            >
              View All Products
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ShopPage;
