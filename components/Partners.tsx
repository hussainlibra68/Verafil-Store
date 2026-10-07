/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Partners: React.FC = () => {
  const partners = [
    {
      name: 'Sony Audio Lab',
      tag: 'Acoustic Engineering',
      logo: (
        <div className="flex items-center gap-2">
          <span className="font-serif tracking-widest text-xl sm:text-2xl font-bold uppercase text-[#2C2A26]">SONY</span>
          <span className="text-[10px] tracking-widest uppercase px-1.5 py-0.5 border border-[#2C2A26]/40 rounded text-[#2C2A26]/80 font-mono">ACOUSTICS</span>
        </div>
      )
    },
    {
      name: 'Apple MFi Certified',
      tag: 'Seamless Integration',
      logo: (
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 170 170" width="22" height="22" fill="currentColor" className="text-[#2C2A26]">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.89-11.96-14.54-6.3-9.76-11.33-20.91-15.09-33.45-3.76-12.54-5.64-24.36-5.64-35.46 0-14.15 3.59-26.04 10.77-35.67 7.18-9.63 16.29-14.55 27.34-14.77 5.09 0 10.59 1.34 16.48 4.02 5.89 2.68 9.94 4.08 12.16 4.22 2.21-.14 6.34-1.54 12.39-4.22 6.06-2.68 11.41-3.95 16.07-3.8 12.28.66 21.84 5.37 28.69 14.14-10.87 6.53-16.19 15.66-15.96 27.4.22 9.14 3.73 16.86 10.53 23.16 6.8 6.3 14.88 9.77 24.23 10.42-2.17 6.74-4.89 13.57-8.15 20.48zM119.22 33.15c0-6.73 2.5-13.04 7.51-17.93 5.01-4.89 11.08-7.94 18.2-9.15.22 1.3.33 2.49.33 3.58 0 6.64-2.6 13.1-7.81 18.37-5.21 5.27-11.42 8.35-18.63 9.24-.1-1.3-.2-2.6-.2-3.91z" />
          </svg>
          <span className="font-sans font-semibold tracking-wider text-base text-[#2C2A26]">MFi Partner</span>
        </div>
      )
    },
    {
      name: 'Leica Precision Optics',
      tag: 'Optical Mastery',
      logo: (
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-[#E23838] flex items-center justify-center text-white text-[10px] font-bold italic font-serif">L</span>
          <span className="font-serif italic font-bold tracking-wider text-lg text-[#2C2A26]">Leica</span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#736E65]">Optics</span>
        </div>
      )
    },
    {
      name: 'Braun Design Institute',
      tag: 'German Minimalism',
      logo: (
        <div className="flex items-center gap-1">
          <span className="font-sans font-extrabold tracking-tight text-xl text-[#2C2A26]">BRAUN</span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#736E65] pl-1">Design</span>
        </div>
      )
    },
    {
      name: 'Tuscan Leather Guild',
      tag: 'Artisan Tannery',
      logo: (
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-serif font-semibold tracking-widest text-[#2C2A26] border-b border-[#2C2A26]/60 pb-0.5">
            CONSORZIO VERA PELLE
          </span>
          <span className="text-[10px] text-[#736E65] font-mono">ITALIA</span>
        </div>
      )
    }
  ];

  return (
    <section className="bg-[#EBE7DE] border-b border-[#D6D1C7] py-8 sm:py-10 px-6">
      <div className="max-w-[1700px] mx-auto flex flex-col items-center justify-center">
        
        {/* Brand Logos Row at Top */}
        <div className="w-full flex flex-wrap items-center justify-center sm:justify-around gap-8 md:gap-14 lg:gap-16 opacity-85 transition-opacity hover:opacity-100 py-3">
          {partners.map((partner) => (
            <div 
              key={partner.name}
              className="flex flex-col items-center justify-center group cursor-default"
              title={`${partner.name} - ${partner.tag}`}
            >
              <div className="grayscale group-hover:grayscale-0 transition-all duration-300">
                {partner.logo}
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[#8C8881] mt-1 group-hover:text-[#2C2A26] transition-colors">
                {partner.tag}
              </span>
            </div>
          ))}
        </div>

        {/* "Our Partners" Written Below The Logos As Requested */}
        <div className="mt-5 text-center flex flex-col items-center">
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 sm:w-12 bg-[#2C2A26]/20"></span>
            <h3 className="text-xs sm:text-sm font-serif uppercase tracking-[0.3em] font-semibold text-[#2C2A26]">
              Our Partners
            </h3>
            <span className="h-[1px] w-8 sm:w-12 bg-[#2C2A26]/20"></span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#736E65] font-light mt-1 tracking-wide">
            Global luxury craftsmanship & engineering collaborations with VERAFIL
          </p>
        </div>

      </div>
    </section>
  );
};

export default Partners;
