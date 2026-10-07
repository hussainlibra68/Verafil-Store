/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string; // e.g. "03334186868"
  message?: string;
}

export const WHATSAPP_NUMBER = '03334186868';
export const WHATSAPP_INTL_NUMBER = '923334186868';

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = WHATSAPP_NUMBER,
  message = 'Hello VERAFIL! I would like to inquire about your products.'
}) => {
  // Normalize phone number to international wa.me format (Pakistan country code +92)
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const waNumber = cleanNumber.startsWith('0') 
    ? '92' + cleanNumber.slice(1) 
    : cleanNumber.startsWith('92') 
      ? cleanNumber 
      : '92' + cleanNumber;

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  return (
    <aside 
      aria-label="WhatsApp customer support"
      className="fixed bottom-3 left-3 z-50 select-none"
    >
      {/* Plain basic WhatsApp button without animation */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`Chat with us on WhatsApp: ${phoneNumber}`}
        aria-label={`Chat with us on WhatsApp: ${phoneNumber}`}
        className="bg-[#25D366] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:bg-[#20ba5a] focus:outline-none"
      >
        {/* WhatsApp Official Vector Icon */}
        <svg 
          viewBox="0 0 24 24" 
          width="26" 
          height="26" 
          fill="currentColor"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.19-.09-1.12-.55-1.3-.61-.17-.07-.3-.1-.43.1-.13.19-.5.62-.61.75-.11.13-.23.15-.42.06-.19-.09-.81-.3-1.54-.95-.57-.51-.96-1.13-1.07-1.32-.11-.19-.01-.3.08-.39.09-.08.19-.23.29-.34.1-.11.13-.19.2-.32.06-.13.03-.24-.02-.34-.05-.09-.43-1.04-.59-1.42-.16-.38-.32-.33-.43-.33-.11 0-.24-.01-.37-.01-.13 0-.34.05-.52.24-.17.19-.67.66-.67 1.6 0 .95.69 1.86.79 1.99.09.13 1.36 2.08 3.3 2.91.46.2.82.32 1.1.41.46.15.89.13 1.22.08.37-.06 1.12-.46 1.28-.9.16-.44.16-.82.11-.9-.05-.08-.18-.13-.37-.22z"/>
        </svg>
      </a>
    </aside>
  );
};

export default WhatsAppButton;
