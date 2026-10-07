/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { WHATSAPP_NUMBER, WHATSAPP_INTL_NUMBER } from './WhatsAppButton';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    
    // Construct WhatsApp message with user input
    const text = `Hello VERAFIL! My name is ${formData.name} (${formData.email || 'No email provided'}). Inquiry: ${formData.message}`;
    const waUrl = `https://wa.me/${WHATSAPP_INTL_NUMBER}?text=${encodeURIComponent(text)}`;
    
    setSubmitted(true);
    window.open(waUrl, '_blank');
  };

  const directWaUrl = `https://wa.me/${WHATSAPP_INTL_NUMBER}?text=${encodeURIComponent('Hello VERAFIL! I would like to connect with your concierge.')}`;

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 bg-[#F5F2EB] text-[#2C2A26] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#8C8881] block mb-3">
            Concierge &amp; Inquiries
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-[#2C2A26] leading-tight">
            Contact VERAFIL
          </h1>
          <p className="mt-4 text-[#5D5A53] text-base md:text-lg font-light leading-relaxed">
            Direct access to our design studio, product concierges, and custom order specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp & Call Highlight Card */}
            <div className="p-8 bg-[#EBE7DE] rounded-3xl border border-[#D6D1C7] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.19-.09-1.12-.55-1.3-.61-.17-.07-.3-.1-.43.1-.13.19-.5.62-.61.75-.11.13-.23.15-.42.06-.19-.09-.81-.3-1.54-.95-.57-.51-.96-1.13-1.07-1.32-.11-.19-.01-.3.08-.39.09-.08.19-.23.29-.34.1-.11.13-.19.2-.32.06-.13.03-.24-.02-.34-.05-.09-.43-1.04-.59-1.42-.16-.38-.32-.33-.43-.33-.11 0-.24-.01-.37-.01-.13 0-.34.05-.52.24-.17.19-.67.66-.67 1.6 0 .95.69 1.86.79 1.99.09.13 1.36 2.08 3.3 2.91.46.2.82.32 1.1.41.46.15.89.13 1.22.08.37-.06 1.12-.46 1.28-.9.16-.44.16-.82.11-.9-.05-.08-.18-.13-.37-.22z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2C2A26]">Direct Line &amp; WhatsApp</h3>
                  <p className="text-xs text-[#736E65]">Immediate answers 7 days a week</p>
                </div>
              </div>

              <div className="my-5">
                <a 
                  href={`tel:${WHATSAPP_NUMBER}`}
                  className="text-3xl font-serif font-bold text-[#2C2A26] hover:text-[#25D366] transition-colors block"
                >
                  {WHATSAPP_NUMBER}
                </a>
                <p className="text-xs text-[#8C8881] font-mono mt-1">International: +92 333 4186868</p>
              </div>

              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-[#25D366] text-white rounded-2xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-all shadow-md"
              >
                <span>Start WhatsApp Chat</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            {/* Studio Details */}
            <div className="p-8 bg-white/70 rounded-3xl border border-[#D6D1C7] space-y-4">
              <div>
                <h4 className="text-xs uppercase font-bold tracking-widest text-[#8C8881]">Hours &amp; Support</h4>
                <p className="text-sm text-[#2C2A26] mt-1 font-medium">Monday &ndash; Sunday: 9:00 AM &ndash; 10:00 PM</p>
                <p className="text-xs text-[#736E65]">Urdu, Roman Urdu, and English available</p>
              </div>

              <div className="pt-4 border-t border-[#D6D1C7]/60">
                <h4 className="text-xs uppercase font-bold tracking-widest text-[#8C8881]">Corporate Atelier</h4>
                <p className="text-sm text-[#2C2A26] mt-1 font-medium">VERAFIL Luxury Living Ltd.</p>
                <p className="text-xs text-[#736E65]">Kyoto Atelier &amp; Global Fulfillment Network</p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7 p-8 md:p-12 bg-white rounded-3xl border border-[#D6D1C7] shadow-sm">
            <h3 className="text-2xl font-serif font-medium text-[#2C2A26] mb-2">Send an Inquiry</h3>
            <p className="text-sm text-[#736E65] font-light mb-8">
              Fill out the details below and we will connect you directly with our specialized concierge on WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-[#5D5A53] mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Khan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F2EB] border border-[#D6D1C7] text-sm text-[#2C2A26] focus:outline-none focus:ring-2 focus:ring-[#2C2A26]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-[#5D5A53] mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F2EB] border border-[#D6D1C7] text-sm text-[#2C2A26] focus:outline-none focus:ring-2 focus:ring-[#2C2A26]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold tracking-wider text-[#5D5A53] mb-2">
                  Message or Product Inquiry *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell us what product, custom sizing, or assistance you require..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F2EB] border border-[#D6D1C7] text-sm text-[#2C2A26] focus:outline-none focus:ring-2 focus:ring-[#2C2A26]/20 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#2C2A26] text-white rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit &amp; Open WhatsApp</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {submitted && (
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium">
                  Thank you! WhatsApp has opened to send your inquiry. We will reply promptly.
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
