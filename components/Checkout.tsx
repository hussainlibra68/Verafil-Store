/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, Order } from '../types';
import { api } from '../src/services/api';
import { formatPKR } from '../src/utils/currency';

interface CheckoutProps {
  items: Product[];
  onBack: () => void;
  onOrderSuccess: (order: Order) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onBack, onOrderSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    orderNotes: '',
    paymentMethod: 'Cash on Delivery',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shipping = 0; // Complimentary Carbon-neutral shipping
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const firstName = formData.firstName.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();

    if (!firstName) {
      setError('Please enter your full name or first name.');
      return;
    }

    if (!phone) {
      setError('Please enter your contact phone number so our courier can deliver.');
      return;
    }

    if (!address) {
      setError('Please provide your delivery address.');
      return;
    }

    if (!city) {
      setError('Please provide your city.');
      return;
    }

    if (items.length === 0) {
      setError('Your shopping bag is empty. Please select a product before placing an order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const customerFullName = formData.lastName.trim() 
        ? `${firstName} ${formData.lastName.trim()}`
        : firstName;

      const fullAddress = formData.apartment.trim()
        ? `${address}, ${formData.apartment.trim()}`
        : address;

      const cleanPhoneDigits = phone.replace(/\D/g, '') || 'guest';
      const finalEmail = formData.email.trim() || `${cleanPhoneDigits}@orders.verafil.store`;

      const orderPayload = {
        customerName: customerFullName,
        customerEmail: finalEmail,
        customerPhone: phone,
        customerAddress: fullAddress,
        city: city || 'Pakistan',
        postalCode: formData.postalCode.trim() || '',
        orderNotes: formData.orderNotes.trim() || '',
        items: items.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: 1,
          imageUrl: i.imageUrl,
          category: i.category,
        })),
        subtotal: Math.max(0, Math.round(Number(subtotal) || 0)),
        total: Math.max(0, Math.round(Number(total) || subtotal)),
        paymentMethod: formData.paymentMethod || 'Cash on Delivery',
      };

      const savedOrder = await api.createOrder(orderPayload);
      setCompletedOrder(savedOrder);
      onOrderSuccess(savedOrder);
    } catch (err: any) {
      console.error('Failed to submit order:', err);
      setError(err.message || 'There was an issue processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order was successfully completed, show the luxury confirmation receipt
  if (completedOrder) {
    return (
      <div className="min-h-screen pt-28 pb-24 px-6 bg-[#F5F2EB] animate-fade-in-up">
        <div className="max-w-3xl mx-auto bg-white/80 border border-[#D6D1C7] p-8 md:p-12 rounded-sm shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8C827A]">Order Confirmed</span>
          <h1 className="text-3xl md:text-4xl font-serif text-[#2C2A26] mt-2 mb-4">
            Thank you, {completedOrder.customerName}!
          </h1>
          <p className="text-sm text-[#5D5A53] max-w-lg mx-auto mb-8">
            Your order has been recorded in our store database. Our concierge team is preparing your package.
          </p>

          <div className="bg-[#F5F2EB]/70 border border-[#D6D1C7] p-6 text-left space-y-4 rounded-xs mb-8">
            <div className="flex justify-between items-center pb-3 border-b border-[#D6D1C7]">
              <span className="text-xs uppercase tracking-wider text-[#8C827A] font-semibold">Order Reference</span>
              <span className="font-serif font-bold text-base text-[#2C2A26]">{completedOrder.id}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#8C827A] uppercase tracking-wider block font-semibold mb-1">Contact Details</span>
                <p className="text-[#2C2A26] font-medium">{completedOrder.customerEmail}</p>
                <p className="text-[#2C2A26]">{completedOrder.customerPhone}</p>
              </div>
              <div>
                <span className="text-[#8C827A] uppercase tracking-wider block font-semibold mb-1">Shipping To</span>
                <p className="text-[#2C2A26] font-medium">{completedOrder.customerAddress}</p>
                <p className="text-[#2C2A26]">{completedOrder.city} {completedOrder.postalCode}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-[#D6D1C7] flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#2C2A26]">Total Amount ({completedOrder.paymentMethod}):</span>
              <span className="font-serif text-xl font-bold text-[#2C2A26]">{formatPKR(completedOrder.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onBack}
              className="px-8 py-4 bg-[#2C2A26] text-[#F5F2EB] text-xs font-semibold uppercase tracking-widest hover:bg-[#433E38] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-[#F5F2EB] animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors mb-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Shop
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Form */}
          <div>
            <h1 className="text-3xl font-serif text-[#2C2A26] mb-2">Checkout</h1>
            <p className="text-xs text-[#5D5A53] mb-8">
              Complete your order. Details will be recorded automatically into the management system.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-rose-100 border border-rose-300 text-rose-800 text-xs rounded-xs font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-10">
              {/* Section 1: Contact */}
              <div>
                <h2 className="text-lg font-serif text-[#2C2A26] mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <input 
                    type="tel" 
                    required
                    placeholder="Contact Number / Mobile / WhatsApp *" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/70 border-b border-[#D6D1C7] p-3 text-xs text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors" 
                  />
                  <input 
                    type="email" 
                    placeholder="Email address (optional)" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/70 border-b border-[#D6D1C7] p-3 text-xs text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors" 
                  />
                </div>
              </div>

              {/* Section 2: Shipping */}
              <div>
                <h2 className="text-lg font-serif text-[#2C2A26] mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      required
                      placeholder="Full Name / First name *" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-white/70 border-b border-[#D6D1C7] p-3 text-xs text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors" 
                    />
                    <input 
                      type="text" 
                      placeholder="Last name (optional)" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-white/70 border-b border-[#D6D1C7] p-3 text-xs text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors" 
                    />
                  </div>
                  <input 
                    type="text" 
                    required
                    placeholder="Street Address, House/Flat No., Area *" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white/70 border-b border-[#D6D1C7] p-3 text-xs text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors" 
                  />
                  <input 
                    type="text" 
                    placeholder="Apartment, suite, landmark (optional)" 
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    className="w-full bg-white/70 border-b border-[#D6D1C7] p-3 text-xs text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors" 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      required
                      placeholder="City (e.g. Lahore, Karachi, Islamabad) *" 
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white/70 border-b border-[#D6D1C7] p-3 text-xs text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors" 
                    />
                    <input 
                      type="text" 
                      placeholder="Postal code (optional)" 
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full bg-white/70 border-b border-[#D6D1C7] p-3 text-xs text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors" 
                    />
                  </div>
                  <textarea 
                    rows={2}
                    placeholder="Order notes or delivery instructions (optional)" 
                    value={formData.orderNotes}
                    onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                    className="w-full bg-white/70 border border-[#D6D1C7] p-3 text-xs text-[#2C2A26] placeholder-[#A8A29E] outline-none focus:border-[#2C2A26] transition-colors" 
                  />
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div>
                <h2 className="text-lg font-serif text-[#2C2A26] mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${
                    formData.paymentMethod === 'Cash on Delivery' ? 'border-[#2C2A26] bg-white' : 'border-[#D6D1C7] bg-white/40'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                      className="accent-[#2C2A26]"
                    />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#2C2A26] block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-[#706B63]">Pay conveniently with cash upon delivery to your doorstep.</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${
                    formData.paymentMethod === 'Card Payment' ? 'border-[#2C2A26] bg-white' : 'border-[#D6D1C7] bg-white/40'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment"
                      checked={formData.paymentMethod === 'Card Payment'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'Card Payment' })}
                      className="accent-[#2C2A26]"
                    />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#2C2A26] block">Credit / Debit Card</span>
                      <span className="text-[11px] text-[#706B63]">Direct secure electronic settlement.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <button 
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full py-5 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-widest text-xs font-semibold hover:bg-[#433E38] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Recording Order in Database...' : `Place Order — ${formatPKR(total)}`}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:pl-12 lg:border-l border-[#D6D1C7]">
            <h2 className="text-xl font-serif text-[#2C2A26] mb-8">Order Summary ({items.length} items)</h2>
            
            <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
              {items.length === 0 ? (
                <div className="py-8 text-center bg-[#EBE7DE]/40 border border-dashed border-[#D6D1C7] p-6 rounded-xs">
                  <p className="text-sm font-serif text-[#2C2A26] mb-2">Your shopping bag is empty.</p>
                  <p className="text-xs text-[#706B63] mb-4">Select an item from our curated collection to place your order.</p>
                  <button
                    type="button"
                    onClick={onBack}
                    className="px-6 py-2.5 bg-[#2C2A26] text-[#F5F2EB] text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors"
                  >
                    Select a Product
                  </button>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-[#EBE7DE] relative shrink-0 border border-[#D6D1C7]">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#2C2A26] text-white text-[10px] flex items-center justify-center rounded-full font-semibold">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-[#2C2A26] text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-[#A8A29E] uppercase tracking-wider">{item.category}</p>
                    </div>
                    <span className="text-sm font-serif font-medium text-[#5D5A53] shrink-0">{formatPKR(item.price)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-[#D6D1C7] pt-6 space-y-2">
              <div className="flex justify-between text-xs text-[#5D5A53]">
                <span>Subtotal</span>
                <span className="font-medium">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#5D5A53]">
                <span>Shipping</span>
                <span className="text-emerald-700 font-medium">Complimentary</span>
              </div>
            </div>
            
            <div className="border-t border-[#D6D1C7] mt-6 pt-6">
              <div className="flex justify-between items-center">
                <span className="font-serif text-xl text-[#2C2A26]">Total</span>
                <span className="font-serif text-2xl text-[#2C2A26] font-medium">{formatPKR(total)}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
