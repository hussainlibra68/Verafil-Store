/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { ProductCategory, CategoryInfo } from '../types';
import { CATEGORIES_DATA, PRODUCTS } from '../constants';

interface ShopByCategoryProps {
  activeCategory?: string;
  onSelectCategory: (category: ProductCategory) => void;
  categories?: CategoryInfo[];
}

const ShopByCategory: React.FC<ShopByCategoryProps> = ({
  activeCategory,
  onSelectCategory,
  categories = CATEGORIES_DATA
}) => {
  // Compute dynamic product count for each category from current catalog
  const getProductCount = (categoryName: ProductCategory, fallbackCount?: number) => {
    const count = PRODUCTS.filter(p => p.category === categoryName).length;
    return count > 0 ? count : (fallbackCount ?? 0);
  };

  const handleCategoryClick = (categoryName: ProductCategory) => {
    onSelectCategory(categoryName);
  };

  return (
    <section 
      id="shop-by-category" 
      className="py-20 md:py-28 px-6 md:px-12 bg-[#F5F2EB] border-b border-[#D6D1C7]/40 relative"
    >
      <div className="max-w-[1700px] mx-auto">
        {/* Header: Center-aligned main heading with subtle subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="inline-block text-xs md:text-sm font-medium uppercase tracking-[0.25em] text-[#8C8881] mb-3">
            Our Categories
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2C2A26] tracking-tight font-normal">
            Shop By Category
          </h2>
          <p className="mt-4 text-[#736E65] text-sm md:text-base font-light leading-relaxed">
            Curated objects engineered for harmony, sensory warmth, and everyday quiet living.
          </p>
        </div>

        {/* Categories Grid / Horizontal Flexbox Layout */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-14">
          {categories.map((cat) => {
            const count = getProductCount(cat.name, cat.count);
            const isSelected = activeCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="group flex flex-col items-center text-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2C2A26] rounded-2xl p-2 transition-transform duration-300 active:scale-95"
                aria-label={`Shop ${cat.name} category (${count} products)`}
              >
                {/* Circular image frame with modern shadow, border and hover animation */}
                <div 
                  className={`relative p-1 sm:p-1.5 rounded-full transition-all duration-500 ease-out 
                    ${isSelected 
                      ? 'border-2 border-[#2C2A26] shadow-xl scale-105 ring-4 ring-[#2C2A26]/10' 
                      : 'border-2 border-[#D6D1C7]/60 hover:border-[#2C2A26] hover:shadow-xl hover:-translate-y-1.5'
                    }`}
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden relative bg-[#EBE7DE] shadow-inner">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-115"
                      loading="lazy"
                    />
                    {/* Soft gradient overlay for contrast on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Active Check/Dot Indicator */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#2C2A26]/15 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="w-3 h-3 rounded-full bg-white shadow-md ring-2 ring-[#2C2A26]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Below circle: Category name in bold text + small item count subtitle */}
                <div className="mt-4 flex flex-col items-center">
                  <span className={`text-base sm:text-lg font-bold transition-colors duration-300 ${
                    isSelected ? 'text-[#2C2A26] underline underline-offset-4' : 'text-[#2C2A26] group-hover:text-black'
                  }`}>
                    {cat.name}
                  </span>
                  <span className="text-xs sm:text-sm text-[#8C8881] font-normal mt-0.5 tracking-wide">
                    {count} {count === 1 ? 'Product' : 'Products'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
