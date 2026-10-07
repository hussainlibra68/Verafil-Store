/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { PRODUCTS } from '../constants';
import { WHATSAPP_NUMBER } from '../components/WhatsAppButton';

const getSystemInstruction = () => {
  const productContext = PRODUCTS.map(p => 
    `- [${p.category}] ${p.name} (PKR ${p.price}): ${p.description} (Features: ${p.features.join(', ')})`
  ).join('\n');

  return `You are the authentic, knowledgeable AI Concierge for "VERAFIL", a warm, organic lifestyle & technology maison.

KEY DIRECTIVES:
1. MULTILINGUAL MASTERY:
   - You are fully multilingual. Instantly detect the user's language and script.
   - If the user writes in English, reply in natural, sophisticated English.
   - If the user writes in Urdu (اردو), reply fluently and gracefully in Urdu script.
   - If the user writes in Roman Urdu / Hindi (e.g., "bhai ye kitnay ka hai", "kya delivery free hai", "mujhe sunglasses chahiye"), reply warmly and naturally in Roman Urdu / Hindi.
   - Also fluently support Arabic, French, Spanish, German, Chinese, and other languages whenever requested.

2. LIGHTNING-FAST & CRISP:
   - Provide direct, helpful answers in 1 to 3 concise sentences.
   - Avoid generic marketing filler. Speak with grounded elegance, clarity, and precision.
   - All prices are in Pakistani Rupees (PKR). Always quote prices in PKR or Rs.

3. OUR REAL PRODUCT CATALOG ACROSS 5 CATEGORIES:
${productContext}

4. STORE DETAILS & CONTACT:
   - Direct WhatsApp Support: Customers can reach our human concierge team directly on WhatsApp at ${WHATSAPP_NUMBER} (+92 333 4186868) anytime.
   - Categories: Fashion, Electronics, Home & Kitchen, Skincare, Eye Care.
   - Shipping: Complimentary nationwide delivery on orders across Pakistan.
   - Returns: 30-day effortless returns with sustainable packaging.
   - Philosophy: Technology designed to disappear into nature; tactile organic materials (sandstone, raw linen, Tuscan leather, cold-pressed botanicals).

When asked about prices, materials, recommendations, or custom inquiries, answer accurately and politely offer our WhatsApp (${WHATSAPP_NUMBER}) for direct instant assistance.`;
};

// High-speed semantic local responder for instant fallback if network/key is unavailable
const getQuickMultilingualResponse = (query: string): string => {
  const q = query.toLowerCase().trim();

  // Roman Urdu or Urdu queries
  const isUrduScript = /[\u0600-\u06FF]/.test(query);
  const isRomanUrdu = /kya|kitne|kitna|hai|bhai|karo|chahiye|shukriya|kese|kaise|qeemat|paisa|deliver|rabta/.test(q);

  if (isUrduScript) {
    if (q.includes('واٹس') || q.includes('رابطہ') || q.includes('نمبر')) {
      return `آپ ہم سے براہِ راست واٹس ایپ پر 03334186868 پر رابطہ کر سکتے ہیں۔ ہماری ٹیم آپ کی فوری مدد کے لیے حاضر ہے۔`;
    }
    if (q.includes('قیمت') || q.includes('پروڈکٹ') || q.includes('سامان')) {
      return `VERAFIL فیشن، الیکٹرانکس، ہوم اور اسکن کیئر کی مصنوعات پیش کرتا ہے۔ مزید تفصیلات اور فوری آرڈر کے لیے واٹس ایپ 03334186868 پر رابطہ فرمائیں۔`;
    }
    return `خوش آمدید! میں VERAFIL کا اسسٹنٹ ہوں۔ آپ مصنوعات کی تفصیلات جان سکتے ہیں یا واٹس ایپ 03334186868 پر رابطہ کر سکتے ہیں۔`;
  }

  if (isRomanUrdu) {
    if (q.includes('whatsapp') || q.includes('number') || q.includes('rabta') || q.includes('contact')) {
      return `Aap hum se WhatsApp par seedha rabta kar saktay hain: ${WHATSAPP_NUMBER} (+92 333 4186868). Hum 24/7 available hain!`;
    }
    if (q.includes('price') || q.includes('kitne') || q.includes('kitna') || q.includes('cost')) {
      return `Hamari tamam products organic materials se bani hain (Fashion, Electronics, Home, Skincare, Eye Care). Kisi bhi product ki price ya order k liye WhatsApp ${WHATSAPP_NUMBER} par message karein!`;
    }
    return `Welcome! Main VERAFIL ka AI concierge hoon. Aap kisi bhi product k baray mein pooch saktay hain ya direct WhatsApp ${WHATSAPP_NUMBER} par rabta kar saktay hain.`;
  }

  // English queries
  if (q.includes('whatsapp') || q.includes('number') || q.includes('phone') || q.includes('contact')) {
    return `You can connect directly with our personal concierge on WhatsApp at ${WHATSAPP_NUMBER} (+92 333 4186868). We are ready to assist you right away!`;
  }
  if (q.includes('skincare') || q.includes('serum') || q.includes('mask')) {
    return `Our Skincare line features the Botanical Renewal Serum ($85) with cold-pressed camellia seed, and the Kyoto Volcanic Clay Mask ($65). Both are crafted with 100% clean minerals.`;
  }
  if (q.includes('eye') || q.includes('eyewear') || q.includes('glasses')) {
    return `Our Eye Care collection includes the Hydro-Peptide Eye Balm ($72) with a chilled ceramic applicator, and handcrafted Circadian Amber Frames ($165) for blue-light protection.`;
  }
  if (q.includes('ship') || q.includes('delivery')) {
    return `We provide complimentary carbon-neutral worldwide shipping on all orders over $150, typically delivered within 3-5 business days.`;
  }
  if (q.includes('fashion') || q.includes('coat') || q.includes('sweater') || q.includes('bag')) {
    return `Our Fashion collection highlights the Silk Linen Coat ($480), Cashmere Mock-Neck Sweater ($320), and Tuscan Vegetable-Tanned Tote ($390).`;
  }

  return `Welcome to VERAFIL. We offer curated objects in Fashion, Electronics, Home & Kitchen, Skincare, and Eye Care. How can I assist you, or would you like to connect on WhatsApp at ${WHATSAPP_NUMBER}?`;
};

export const sendMessageToGemini = async (
  history: { role: string; text: string }[], 
  newMessage: string
): Promise<string> => {
  let apiKey: string | undefined;

  try {
    // Check both standard client/server env variables
    if (typeof process !== 'undefined' && process.env) {
      apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    }
  } catch (e) {
    // Process env access failed
  }

  // If no API key is set, deliver our rich, instant multilingual answer
  if (!apiKey) {
    return getQuickMultilingualResponse(newMessage);
  }

  try {
    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Use gemini-3.8-flash with LOW thinking level for rapid multilingual responses
    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: getSystemInstruction(),
        temperature: 0.7,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW
        }
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    const reply = result.text?.trim();

    return reply || getQuickMultilingualResponse(newMessage);

  } catch (error) {
    console.warn("Gemini Live API fallback activated:", error);
    // Graceful instantaneous fallback so the AI stays real and never crashes
    return getQuickMultilingualResponse(newMessage);
  }
};
