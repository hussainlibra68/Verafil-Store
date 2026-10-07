/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { formatPKR } from '../src/utils/currency';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const [copied, setCopied] = useState(false);

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = window.location.origin;
    const shareUrl = `${origin}?product=${product.id}#product-${product.id}`;

    if (navigator.share) {
      navigator.share({
        title: `${product.name} | VERAFIL`,
        text: `${product.name} - ${formatPKR(product.price)}`,
        url: shareUrl,
      }).catch(() => {
        copyUrl(shareUrl);
      });
    } else {
      copyUrl(shareUrl);
    }
  };

  const copyUrl = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      window.prompt('Copy product link:', url);
    }
  };

  return (
    <div className="group flex flex-col gap-6 cursor-pointer relative" onClick={() => onClick(product)}>
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EBE7DE]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 sepia-[0.1]"
        />

        {/* Quick Share Button in top right */}
        <button
          onClick={handleShareClick}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-[#2C2A26] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-xs"
          title="Share Product Link"
        >
          {copied ? (
            <span className="text-[10px] font-bold text-emerald-700">✓</span>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          )}
        </button>
        
        {/* Hover overlay with "Quick View" */}
        <div className="absolute inset-0 bg-[#2C2A26]/0 group-hover:bg-[#2C2A26]/5 transition-colors duration-500 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <span className="bg-white/95 backdrop-blur-xs text-[#2C2A26] px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold shadow-xs">
              View Details
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-2xl font-serif font-medium text-[#2C2A26] mb-1 group-hover:opacity-70 transition-opacity">{product.name}</h3>
        <p className="text-sm font-light text-[#5D5A53] mb-3 tracking-wide">{product.category}</p>
        <span className="text-sm font-serif font-medium text-[#2C2A26] block">{formatPKR(product.price)}</span>
      </div>
    </div>
  );
};

export default ProductCard;
