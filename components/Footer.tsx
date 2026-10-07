/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { WHATSAPP_NUMBER } from './WhatsAppButton';

interface FooterProps {
  onNavigate: (viewType: 'home' | 'shop' | 'about' | 'contact', targetId?: string) => void;
  onOpenSecretAdmin?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSecretAdmin }) => {
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email) return;
    setSubscribeStatus('loading');
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
    }, 1200);
  };

  return (
    <footer className="bg-[#EBE7DE] pt-24 pb-12 px-6 text-[#5D5A53] border-t border-[#D6D1C7]">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        
        <div className="md:col-span-4">
          <h4 className="text-2xl font-serif text-[#2C2A26] mb-4">VERAFIL</h4>
          <p className="max-w-xs font-light leading-relaxed mb-6">
            Designing quiet, premium technology and luxury goods that feel as natural as the earth. 
            Born from the earth, built for the mind.
          </p>
          <div className="text-xs text-[#8C8881] space-y-1 font-mono">
            <p>Direct Support &amp; WhatsApp: {WHATSAPP_NUMBER}</p>
            <p>International: +92 333 4186868</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-medium text-[#2C2A26] mb-6 tracking-wide text-xs uppercase">Navigation</h4>
          <ul className="space-y-3.5 font-light text-sm">
            <li>
              <button 
                onClick={() => onNavigate('home')} 
                className="hover:text-[#2C2A26] transition-colors text-left"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('shop')} 
                className="hover:text-[#2C2A26] transition-colors text-left"
              >
                Shop All Products
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('home', 'shop-by-category')} 
                className="hover:text-[#2C2A26] transition-colors text-left"
              >
                Browse Categories
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('about')} 
                className="hover:text-[#2C2A26] transition-colors text-left"
              >
                About Our Standards
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('contact')} 
                className="hover:text-[#2C2A26] transition-colors text-left"
              >
                Contact &amp; Concierge
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-medium text-[#2C2A26] mb-6 tracking-wide text-xs uppercase">Categories</h4>
          <ul className="space-y-3.5 font-light text-sm">
            <li>
              <button 
                onClick={() => onNavigate('shop', 'Fashion')} 
                className="hover:text-[#2C2A26] transition-colors text-left"
              >
                Fashion
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('shop', 'Electronics')} 
                className="hover:text-[#2C2A26] transition-colors text-left"
              >
                Electronics
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('shop', 'Home & Kitchen')} 
                className="hover:text-[#2C2A26] transition-colors text-left"
              >
                Home &amp; Kitchen
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('shop', 'Skincare')} 
                className="hover:text-[#2C2A26] transition-colors text-left"
              >
                Skincare
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('shop', 'Eye Care')} 
                className="hover:text-[#2C2A26] transition-colors text-left"
              >
                Eye Care
              </button>
            </li>
          </ul>
        </div>
        
        <div className="md:col-span-4">
          <h4 className="font-medium text-[#2C2A26] mb-6 tracking-wide text-xs uppercase">Concierge Newsletter</h4>
          <p className="text-xs text-[#736E65] mb-4">Receive invitations to private collections and seasonal releases.</p>
          <div className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="email@address.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
              className="bg-transparent border-b border-[#A8A29E] py-2 text-sm outline-none focus:border-[#2C2A26] transition-colors placeholder-[#A8A29E]/70 text-[#2C2A26] disabled:opacity-50" 
            />
            <button 
              onClick={handleSubscribe}
              disabled={subscribeStatus !== 'idle' || !email}
              className="self-start text-xs font-semibold uppercase tracking-widest mt-2 hover:text-[#2C2A26] disabled:cursor-default disabled:hover:text-[#5D5A53] disabled:opacity-50 transition-opacity"
            >
              {subscribeStatus === 'idle' && 'Subscribe'}
              {subscribeStatus === 'loading' && 'Subscribing...'}
              {subscribeStatus === 'success' && 'Subscribed'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto mt-16 pt-8 border-t border-[#D6D1C7] flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest opacity-70">
        <p>
          <button
            type="button"
            onClick={onOpenSecretAdmin}
            className="hover:opacity-100 hover:text-[#2C2A26] transition-opacity cursor-pointer text-inherit"
            title="VERAFIL"
            aria-label="Security Access"
          >
            &copy;
          </button>{' '}
          {new Date().getFullYear()} VERAFIL. All rights reserved.
        </p>
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <p>Premium Standard Craftsmanship &bull; Phone: {WHATSAPP_NUMBER}</p>
          {onOpenSecretAdmin && (
            <button
              type="button"
              onClick={onOpenSecretAdmin}
              className="w-1.5 h-1.5 rounded-full bg-[#2C2A26]/20 hover:bg-[#2C2A26]/80 transition-colors cursor-pointer"
              title="Portal"
              aria-label="Secret Portal"
            />
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
