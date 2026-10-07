/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { WHATSAPP_NUMBER, WHATSAPP_INTL_NUMBER } from './WhatsAppButton';

const QUICK_PROMPTS = [
  { label: 'Best Sellers', query: 'What are your top bestselling products across all categories?' },
  { label: 'WhatsApp Concierge', query: `How can I connect with your team on WhatsApp ${WHATSAPP_NUMBER}?` },
  { label: 'اردو میں رہنمائی', query: 'کیا آپ مجھے اردو میں مصنوعات اور قیمتوں کے بارے میں بتا سکتے ہیں؟' },
  { label: 'Skincare & Eye Care', query: 'Tell me about your Skincare and Eye Care collection.' },
];

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: `Welcome to VERAFIL. I am your real-time multilingual AI concierge. Ask me anything in English, Urdu (اردو), or Roman Urdu, or reach us directly on WhatsApp at ${WHATSAPP_NUMBER}!`, 
      timestamp: Date.now() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isThinking]);

  const sendQuery = async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMsg: ChatMessage = { role: 'user', text: text.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendMessageToGemini(history, userMsg.text);
      
      const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const fallbackMsg: ChatMessage = { 
        role: 'model', 
        text: `You can reach our personal concierge directly on WhatsApp at ${WHATSAPP_NUMBER} (+92 333 4186868) for immediate assistance!`, 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = () => {
    sendQuery(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const waDirectUrl = `https://wa.me/${WHATSAPP_INTL_NUMBER}?text=${encodeURIComponent('Hello VERAFIL! I was speaking with your AI assistant and would like direct assistance.')}`;

  return (
    <aside 
      aria-label="VERAFIL AI Assistant"
      className="fixed bottom-8 right-8 z-50 flex flex-col items-end font-sans"
    >
      {isOpen && (
        <div className="bg-[#F5F2EB] rounded-2xl shadow-2xl shadow-[#2C2A26]/15 w-[92vw] sm:w-[410px] h-[580px] mb-4 flex flex-col overflow-hidden border border-[#D6D1C7] animate-slide-up-fade">
          {/* Header */}
          <div className="bg-[#EBE7DE] px-5 py-4 border-b border-[#D6D1C7] flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </div>
              <div>
                <span className="font-serif italic text-[#2C2A26] text-lg font-medium">VERAFIL Concierge</span>
                <span className="block text-[10px] uppercase tracking-widest text-[#8C8881]">Multilingual AI • Fast</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* WhatsApp Quick Direct Link in Header */}
              <a 
                href={waDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Chat on WhatsApp (${WHATSAPP_NUMBER})`}
                className="flex items-center gap-1.5 bg-[#25D366]/15 text-[#128C7E] hover:bg-[#25D366] hover:text-white px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zM12 20.3c-1.42 0-2.8-.37-4.01-1.07l-.29-.17-2.98.78.79-2.9-.19-.3a8.27 8.27 0 1 1 6.68 3.66z"/>
                </svg>
                <span>WhatsApp</span>
              </a>

              <button 
                onClick={() => setIsOpen(false)} 
                aria-label="Close assistant"
                className="text-[#A8A29E] hover:text-[#2C2A26] p-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-[#FAF8F5] px-4 py-2 border-b border-[#D6D1C7]/60 overflow-x-auto no-scrollbar flex gap-2">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => sendQuery(qp.query)}
                disabled={isThinking}
                className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-[#2C2A26] hover:text-white text-[#5D5A53] border border-[#D6D1C7]/80 transition-all duration-200 shadow-2xs"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F5F2EB]" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[88%] px-4 py-3 text-sm leading-relaxed rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-[#2C2A26] text-[#F5F2EB] rounded-br-xs shadow-sm' 
                      : 'bg-white border border-[#EBE7DE] text-[#2C2A26] rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {/* If the message mentions WhatsApp, provide an instant clickable action button */}
                  {msg.text.includes(WHATSAPP_NUMBER) && (
                    <a
                      href={waDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-xs transition-colors"
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>
                      </svg>
                      Open WhatsApp ({WHATSAPP_NUMBER})
                    </a>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#EBE7DE] px-4 py-3 rounded-2xl rounded-bl-xs flex gap-1.5 items-center shadow-xs">
                  <span className="text-xs text-[#8C8881] font-light mr-1">Thinking...</span>
                  <div className="w-1.5 h-1.5 bg-[#2C2A26] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#2C2A26] rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-[#2C2A26] rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#EBE7DE]/70 border-t border-[#D6D1C7]">
            <div className="flex gap-2 relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask in English, اردو, or Roman Urdu..." 
                className="flex-1 bg-white border border-[#D6D1C7] focus:border-[#2C2A26] px-4 py-2.5 text-sm rounded-xl outline-none transition-colors placeholder-[#A8A29E] text-[#2C2A26]"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isThinking}
                aria-label="Send message"
                className="bg-[#2C2A26] text-[#F5F2EB] px-4 py-2.5 rounded-xl hover:bg-[#444] transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-[#8C8881]">
              <span>Supports all languages</span>
              <a 
                href={waDirectUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#25D366] underline underline-offset-2 transition-colors"
              >
                WhatsApp: {WHATSAPP_NUMBER}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Launcher Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI Concierge" : "Open AI Concierge"}
        className="bg-[#2C2A26] text-[#F5F2EB] w-14 h-14 flex items-center justify-center rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#2C2A26]/30 cursor-pointer"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span className="font-serif italic text-lg leading-none font-medium">Ai</span>
            <span className="text-[8px] uppercase tracking-widest text-[#D6D1C7] mt-0.5">Chat</span>
          </div>
        )}
      </button>
    </aside>
  );
};

export default Assistant;
