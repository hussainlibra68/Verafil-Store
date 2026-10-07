/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { WHATSAPP_NUMBER, WHATSAPP_INTL_NUMBER } from './WhatsAppButton';

interface AboutProps {
  isFullPage?: boolean;
  onExploreShop?: () => void;
}

const About: React.FC<AboutProps> = ({ isFullPage = false, onExploreShop }) => {
  const waUrl = `https://wa.me/${WHATSAPP_INTL_NUMBER}?text=${encodeURIComponent('Hello VERAFIL! I would like to inquire about your premium standard products.')}`;

  return (
    <section id="about" className="bg-[#EBE7DE] text-[#2C2A26]">
      
      {/* Hero Banner for Dedicated Page */}
      {isFullPage && (
        <div className="pt-36 pb-16 px-6 md:px-12 max-w-[1800px] mx-auto text-center border-b border-[#D6D1C7]">
          <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-[#8C8881] mb-4 block">
            About VERAFIL
          </span>
          <h1 className="text-4xl md:text-7xl font-serif text-[#2C2A26] leading-tight max-w-4xl mx-auto">
            The Standard of Quiet Luxury &amp; Precision Craft.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[#5D5A53] max-w-2xl mx-auto font-light leading-relaxed">
            Every creation under the VERAFIL hallmark is engineered to top-class international benchmarks—where tactile earthen matter meets acoustic purity.
          </p>

          {/* Quick Direct Number Badge */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white/80 border border-[#D6D1C7] px-6 py-3 rounded-full shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider text-[#736E65] font-medium">Concierge &amp; Inquiries:</span>
            <a 
              href={waUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#2C2A26] hover:text-[#25D366] transition-colors flex items-center gap-1.5"
            >
              <span>{WHATSAPP_NUMBER}</span>
              <span className="text-[11px] font-mono text-[#8C8881]">(+92 333 4186868)</span>
            </a>
          </div>
        </div>
      )}

      {/* Introduction / Story */}
      <div className="py-20 md:py-28 px-6 md:px-12 max-w-[1800px] mx-auto flex flex-col md:flex-row items-start gap-12 md:gap-28">
        <div className="md:w-1/3">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C8881] block mb-4">
            Our Origin
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#2C2A26] leading-tight">
            Born from the earth, <br/> built for the mind.
          </h2>
          
          {/* Prominent Contact Card in About */}
          <div className="mt-10 p-6 bg-[#F5F2EB] rounded-2xl border border-[#D6D1C7] shadow-xs">
            <div className="flex items-center gap-2 text-[#25D366] mb-2">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.19-.09-1.12-.55-1.3-.61-.17-.07-.3-.1-.43.1-.13.19-.5.62-.61.75-.11.13-.23.15-.42.06-.19-.09-.81-.3-1.54-.95-.57-.51-.96-1.13-1.07-1.32-.11-.19-.01-.3.08-.39.09-.08.19-.23.29-.34.1-.11.13-.19.2-.32.06-.13.03-.24-.02-.34-.05-.09-.43-1.04-.59-1.42-.16-.38-.32-.33-.43-.33-.11 0-.24-.01-.37-.01-.13 0-.34.05-.52.24-.17.19-.67.66-.67 1.6 0 .95.69 1.86.79 1.99.09.13 1.36 2.08 3.3 2.91.46.2.82.32 1.1.41.46.15.89.13 1.22.08.37-.06 1.12-.46 1.28-.9.16-.44.16-.82.11-.9-.05-.08-.18-.13-.37-.22z"/>
              </svg>
              <span className="text-xs uppercase font-bold tracking-widest text-[#2C2A26]">Customer Hotline</span>
            </div>
            <p className="text-xs text-[#736E65] mb-3">Direct assistance, order tracking &amp; bespoke orders:</p>
            <a 
              href={`tel:${WHATSAPP_NUMBER}`}
              className="text-xl font-serif font-bold text-[#2C2A26] block hover:text-[#25D366] transition-colors"
            >
              {WHATSAPP_NUMBER}
            </a>
            <p className="text-[11px] text-[#8C8881] font-mono mt-0.5">International: +92 333 4186868</p>
            <a 
              href={waUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center w-full py-2.5 px-4 bg-[#25D366] text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#20ba5a] transition-colors"
            >
              Connect On WhatsApp
            </a>
          </div>
        </div>

        <div className="md:w-2/3 max-w-2xl">
          <p className="text-lg md:text-xl text-[#5D5A53] font-light leading-relaxed mb-6">
            VERAFIL was founded on a simple but radical premise: products should never feel disposable or clinical. They should feel like a stone smoothed by a river, or a page turned in an antique library.
          </p>
          <p className="text-lg md:text-xl text-[#5D5A53] font-light leading-relaxed mb-8">
            In an age of endless synthetic noise and planned obsolescence, VERAFIL crafts timeless companions for modern life. We unite European minimalist architecture with organic Japanese craftsmanship to produce top-class standard goods across Fashion, Ambient Electronics, Culinary Ware, and Botanical Care.
          </p>
          <img 
            src="https://images.pexels.com/photos/6583355/pexels-photo-6583355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="VERAFIL Design Studio" 
            className="w-full h-[400px] object-cover grayscale contrast-[0.9] brightness-110 mt-6 rounded-2xl border border-[#D6D1C7]"
          />
          <p className="text-sm font-medium uppercase tracking-widest text-[#A8A29E] mt-4">
            The VERAFIL Design Atelier &amp; Quality Laboratory
          </p>
        </div>
      </div>

      {/* NEW: Premium Top Class Standard Products Showcase */}
      <div className="bg-[#2C2A26] text-[#F5F2EB] py-24 px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#A8A29E] block mb-3">
              Uncompromising Quality
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5F2EB] leading-tight">
              Our Premium Top-Class Standard
            </h2>
            <p className="mt-4 text-[#A8A29E] text-base md:text-lg font-light leading-relaxed">
              Every single product bearing the VERAFIL hallmark undergoes meticulous grading, certified raw material sourcing, and master artisan assembly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Standard 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xs flex flex-col justify-between hover:border-white/20 transition-all duration-300">
              <div>
                <span className="font-mono text-xs text-[#25D366] font-bold block mb-4">01 / MATERIALS</span>
                <h3 className="text-xl font-serif text-white mb-3">Single-Origin Grade-A Matter</h3>
                <p className="text-sm text-[#D6D1C7]/80 leading-relaxed font-light">
                  From 100% Grade A single-origin Mongolian cashmere and raw Italian silk to Tuscan vegetable-tanned leather and Kyoto sandstone. No fillers, synthetic blends, or toxic varnishes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#A8A29E] uppercase tracking-wider font-mono">
                Pure Provenance
              </div>
            </div>

            {/* Standard 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xs flex flex-col justify-between hover:border-white/20 transition-all duration-300">
              <div>
                <span className="font-mono text-xs text-[#25D366] font-bold block mb-4">02 / ACOUSTICS &amp; TECH</span>
                <h3 className="text-xl font-serif text-white mb-3">Engineered Acoustic Mastery</h3>
                <p className="text-sm text-[#D6D1C7]/80 leading-relaxed font-light">
                  Our ambient electronics and audio systems are engineered in collaboration with acoustic labs, using open-air drivers, paper-grade OLED nano panels, and silent thermal dissipation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#A8A29E] uppercase tracking-wider font-mono">
                Studio-Grade Output
              </div>
            </div>

            {/* Standard 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xs flex flex-col justify-between hover:border-white/20 transition-all duration-300">
              <div>
                <span className="font-mono text-xs text-[#25D366] font-bold block mb-4">03 / HAND CRAFTSMANSHIP</span>
                <h3 className="text-xl font-serif text-white mb-3">48-Hour Hand Polish</h3>
                <p className="text-sm text-[#D6D1C7]/80 leading-relaxed font-light">
                  Ceramic vessels, horn buttons, and aluminum bodies are polished and checked by veteran craftsmen. Natural materials are allowed to mature with an organic patina unique to each owner.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#A8A29E] uppercase tracking-wider font-mono">
                Heirloom Longevity
              </div>
            </div>

            {/* Standard 4 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xs flex flex-col justify-between hover:border-white/20 transition-all duration-300">
              <div>
                <span className="font-mono text-xs text-[#25D366] font-bold block mb-4">04 / VERIFICATION</span>
                <h3 className="text-xl font-serif text-white mb-3">Dedicated Concierge</h3>
                <p className="text-sm text-[#D6D1C7]/80 leading-relaxed font-light">
                  Every order includes authentic serial stamping and personal concierge advisory. Call or WhatsApp our team at <strong>03334186868</strong> for product care, styling, and worldwide delivery support.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-[#A8A29E] uppercase tracking-wider font-mono">
                Direct Human Care
              </div>
            </div>

          </div>

          {/* Action Callout */}
          <div className="mt-16 text-center">
            {onExploreShop && (
              <button
                onClick={onExploreShop}
                className="px-8 py-3.5 bg-[#F5F2EB] text-[#2C2A26] rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all shadow-md"
              >
                Explore The Premium Collection
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Materiality & Ecosystem Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        <div className="order-2 lg:order-1 relative h-[450px] lg:h-auto overflow-hidden group">
           <img 
             src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1200" 
             alt="Natural Stone Texture" 
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
           />
        </div>
        <div className="order-1 lg:order-2 flex flex-col justify-center p-10 lg:p-20 bg-[#D6D1C7]">
           <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5D5A53] mb-4">Tactility First</span>
           <h3 className="text-3xl md:text-5xl font-serif mb-6 text-[#2C2A26] leading-tight">
             Materials that age <br/> with grace.
           </h3>
           <p className="text-base md:text-lg text-[#5D5A53] font-light leading-relaxed max-w-md">
             We reject plastic disposability. Every VERAFIL item is sculpted from high-grade natural sandstone, unpolished aluminum, and organic loomed fabrics that tell the story of your life.
           </p>
        </div>
      </div>

      {/* Contact Banner strip */}
      <div className="py-14 px-6 md:px-12 bg-[#E0DCD3] border-t border-[#D6D1C7]">
        <div className="max-w-[1800px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-2xl font-serif text-[#2C2A26]">Have a question for our team?</h4>
            <p className="text-sm text-[#5D5A53] mt-1">Our specialists are ready on phone and WhatsApp: <strong>{WHATSAPP_NUMBER}</strong></p>
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] text-white rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-[#20ba5a] transition-colors shadow-sm"
          >
            Chat On WhatsApp Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
