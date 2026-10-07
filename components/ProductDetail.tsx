/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { formatPKR } from '../src/utils/currency';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos'>('photos');
  const [copiedLink, setCopiedLink] = useState(false);

  // Gallery of images
  const allImages = (product.gallery && product.gallery.length > 0)
    ? product.gallery
    : [product.imageUrl];

  const [selectedImage, setSelectedImage] = useState<string>(allImages[0] || product.imageUrl);

  // Videos list
  const allVideos = (product.videos && product.videos.length > 0) ? product.videos : [];

  // Sizes for wearable and fashion items
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const showSizes = product.category === 'Fashion' && (product.name.includes('Coat') || product.name.includes('Sweater') || product.name.includes('Robe'));

  // Sharable link handling
  const handleShare = () => {
    const origin = window.location.origin;
    const shareUrl = `${origin}?product=${product.id}#product-${product.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${product.name} | VERAFIL`,
        text: `${product.name} - ${formatPKR(product.price)}: ${product.tagline || product.description}`,
        url: shareUrl,
      }).catch(() => {
        // Fallback to clipboard
        copyToClipboard(shareUrl);
      });
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } else {
      window.prompt('Copy product link:', url);
    }
  };

  const handleWhatsAppShare = () => {
    const origin = window.location.origin;
    const shareUrl = `${origin}?product=${product.id}#product-${product.id}`;
    const text = encodeURIComponent(`Check out ${product.name} (${formatPKR(product.price)}) on VERAFIL:\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="pt-24 min-h-screen bg-[#F5F2EB] animate-fade-in-up">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-24">
        
        {/* Breadcrumb / Back & Share Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Catalog
          </button>

          {/* Share Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[#D6D1C7] hover:border-[#2C2A26] bg-white/60 text-xs uppercase tracking-wider font-semibold transition-colors"
              title="Share this product"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="p-1.5 border border-[#D6D1C7] hover:border-[#25D366] text-[#25D366] bg-white/60 transition-colors"
              title="Share on WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.288.043.088.072.19.014.305-.058.115-.087.187-.173.289l-.26.309c-.087.087-.178.181-.077.355.101.173.449.741.964 1.2.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left: Media Section (Photo Gallery & Videos) */}
          <div className="flex flex-col gap-4">
            
            {/* Media Selector Tabs if videos are available */}
            {allVideos.length > 0 && (
              <div className="flex gap-4 border-b border-[#D6D1C7] pb-2 text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => setActiveMediaTab('photos')}
                  className={`pb-1 border-b-2 transition-colors ${
                    activeMediaTab === 'photos' ? 'border-[#2C2A26] text-[#2C2A26]' : 'border-transparent text-[#8C827A]'
                  }`}
                >
                  Photos ({allImages.length})
                </button>
                <button
                  onClick={() => setActiveMediaTab('videos')}
                  className={`pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                    activeMediaTab === 'videos' ? 'border-[#2C2A26] text-[#2C2A26]' : 'border-transparent text-[#8C827A]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Videos ({allVideos.length})
                </button>
              </div>
            )}

            {activeMediaTab === 'photos' ? (
              <>
                {/* Main Large Image Display */}
                <div className="w-full aspect-[4/5] bg-[#EBE7DE] overflow-hidden border border-[#D6D1C7]/60 shadow-xs">
                  <img 
                    src={selectedImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover animate-fade-in-up"
                  />
                </div>

                {/* Thumbnail Gallery (At least 4 images support) */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`aspect-square overflow-hidden border transition-all ${
                          selectedImage === img 
                            ? 'border-[#2C2A26] ring-1 ring-[#2C2A26] opacity-100 scale-95' 
                            : 'border-[#D6D1C7] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Videos Display */
              <div className="space-y-6">
                {allVideos.map((vidUrl, idx) => (
                  <div key={idx} className="border border-[#D6D1C7] bg-white p-3 rounded-xs shadow-xs">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C827A] block mb-2">
                      Video Demonstration #{idx + 1}
                    </span>
                    <div className="w-full aspect-video bg-[#EBE7DE] overflow-hidden">
                      <video
                        src={vidUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Buying Info */}
          <div className="flex flex-col justify-center max-w-xl">
             <div className="flex items-center gap-3 mb-2">
               <span className="text-xs font-semibold text-[#8C827A] uppercase tracking-widest">{product.category}</span>
               {product.inStock !== false ? (
                 <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">In Stock</span>
               ) : (
                 <span className="text-[10px] tracking-wider uppercase font-semibold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">Sold Out</span>
               )}
             </div>

             <h1 className="text-4xl md:text-5xl font-serif text-[#2C2A26] mb-3">{product.name}</h1>
             {product.tagline && (
               <p className="text-sm italic font-serif text-[#706B63] mb-4">{product.tagline}</p>
             )}
             
             <span className="text-3xl font-serif font-light text-[#2C2A26] mb-8">{formatPKR(product.price)}</span>
             
             <p className="text-[#5D5A53] leading-relaxed font-light text-base md:text-lg mb-8 border-b border-[#D6D1C7] pb-8">
               {product.longDescription || product.description}
             </p>

             {showSizes && (
                <div className="mb-8">
                  <span className="block text-xs font-bold uppercase tracking-widest text-[#2C2A26] mb-4">Select Size</span>
                  <div className="flex gap-4">
                    {sizes.map(size => (
                      <button 
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 ${
                          selectedSize === size 
                            ? 'border-[#2C2A26] bg-[#2C2A26] text-[#F5F2EB]' 
                            : 'border-[#D6D1C7] text-[#5D5A53] hover:border-[#2C2A26]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
             )}

             <div className="flex flex-col gap-4">
               <button 
                 onClick={() => onAddToCart(product)}
                 disabled={product.inStock === false}
                 className="w-full py-5 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-widest text-xs font-semibold hover:bg-[#433E38] transition-colors shadow-sm disabled:opacity-40"
               >
                 {product.inStock !== false ? `Add to Shopping Bag — ${formatPKR(product.price)}` : 'Item Currently Unavailable'}
               </button>
               
               {/* Sharable Product Link Bar */}
               <div className="flex items-center justify-between p-3.5 bg-white/70 border border-[#D6D1C7] rounded-xs text-xs">
                 <div className="flex items-center gap-2 text-[#706B63]">
                   <svg className="w-4 h-4 text-[#2C2A26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                   </svg>
                   <span>Direct Sharable Link</span>
                 </div>
                 <button
                   onClick={handleShare}
                   className="font-semibold uppercase tracking-wider text-[#2C2A26] hover:underline"
                 >
                   {copiedLink ? 'Copied!' : 'Copy Link'}
                 </button>
               </div>

               {product.features && product.features.length > 0 && (
                 <div className="mt-6 border-t border-[#D6D1C7] pt-6">
                   <h3 className="text-xs uppercase font-bold tracking-widest text-[#8C827A] mb-3">Key Highlights</h3>
                   <ul className="space-y-2 text-xs text-[#5D5A53]">
                     {product.features.map((feature, idx) => (
                       <li key={idx} className="flex items-center gap-3">
                         <span className="w-1.5 h-1.5 bg-[#2C2A26] rounded-full"></span>
                         {feature}
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
