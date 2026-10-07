/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product, JournalArticle, CategoryInfo } from './types';

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'cat-fashion',
    name: 'Fashion',
    subtitle: 'Apparel & Leathercraft',
    count: 3,
    imageUrl: '/src/assets/images/fashion_circle_1790681677395.jpg',
    link: '#products'
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    subtitle: 'Acoustics & Ambient Tech',
    count: 4,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    link: '#products'
  },
  {
    id: 'cat-home-kitchen',
    name: 'Home & Kitchen',
    subtitle: 'Ceramics & Ritual Dining',
    count: 4,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    link: '#products'
  },
  {
    id: 'cat-skincare',
    name: 'Skincare',
    subtitle: 'Botanicals & Mineral Balms',
    count: 2,
    imageUrl: '/src/assets/images/skincare_circle_1790681662969.jpg',
    link: '#products'
  },
  {
    id: 'cat-eyecare',
    name: 'Eye Care',
    subtitle: 'Cooling Balms & Optics',
    count: 2,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800',
    link: '#products'
  }
];

export const PRODUCTS: Product[] = [
  // Electronics
  {
    id: 'p1',
    name: 'VERAFIL Harmony',
    tagline: 'Listen naturally.',
    description: 'Audio that feels like the open air. Constructed with warm acoustic fabric and recycled sandstone composite.',
    longDescription: 'Experience sound as it was meant to be heard—unconfined and organic. The VERAFIL Harmony headphones feature our proprietary open-air driver technology, encased in a breathable acoustic fabric that adapts to your temperature. The headband is crafted from a recycled sandstone composite, offering a unique, cool-to-the-touch texture that grounds you in the present moment.',
    price: 429,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1524678606372-565ae0f98944?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Organic Noise Cancellation', '50h Battery', 'Natural Soundstage']
  },
  {
    id: 'p2',
    name: 'VERAFIL Epoch',
    tagline: 'Moments, not minutes.',
    description: 'A timepiece designed for wellness. Ceramic casing with a strap made from sustainable vegan leather.',
    longDescription: 'Time is not a sequence of numbers, but a flow of moments. The VERAFIL Epoch rethinks the smartwatch interface, using a calm E-Ink hybrid display that mimics paper. It tracks stress through skin temperature and heart rate variability, gently vibrating to remind you to breathe. The ceramic casing is hypoallergenic and smooth, polished by hand for 48 hours.',
    price: 349,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
    gallery: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Stress Monitoring', 'E-Ink Hybrid Display', '7-Day Battery']
  },
  {
    id: 'p3',
    name: 'VERAFIL Canvas',
    tagline: 'Capture the warmth.',
    description: 'A display that mimics the properties of paper. Soft on the eyes, vivid in color, and textured to the touch.',
    longDescription: 'Screens shouldn\'t feel like looking into a lightbulb. VERAFIL Canvas uses a matte, nano-etched OLED panel that scatters ambient light, creating a display that looks and feels like high-quality magazine paper. Perfect for reading, sketching, or displaying art, it brings a tactile warmth to your digital life.',
    price: 1099,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
    gallery: [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Paper-like OLED', 'Portrait Lens', 'Sandstone Texture']
  },
  {
    id: 'p6',
    name: 'VERAFIL Scribe',
    tagline: 'Thought in motion.',
    description: 'A digital stylus with the friction of graphite. Charges wirelessly when magnetically attached to VERAFIL Canvas.',
    longDescription: 'The connection between hand and brain is sacred. VERAFIL Scribe features a custom elastomer tip that replicates the microscopic friction of graphite on paper. Weighted perfectly for balance, it disappears in your hand, leaving only your thoughts.',
    price: 129,
    category: 'Electronics',
    imageUrl: 'https://images.pexels.com/photos/2647376/pexels-photo-2647376.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    gallery: [
        'https://images.pexels.com/photos/2647376/pexels-photo-2647376.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.unsplash.com/photo-1517260487576-8977430081d3?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Zero Latency', 'Textured Tip', 'Wireless Charging']
  },

  // Fashion
  {
    id: 'p7',
    name: 'VERAFIL Silk Linen Coat',
    tagline: 'Flow in timeless drape.',
    description: 'Tailored from raw Italian silk and organic unbleached linen with handcrafted horn buttons.',
    longDescription: 'Crafted for effortless presence, the VERAFIL Coat marries breathable organic flax with heavy raw silk. Its fluid drape responds naturally to movement, while the neutral earthen hue develops a soft patina over years of wear.',
    price: 480,
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['70% Raw Silk / 30% Organic Linen', 'Hand-stitched horn buttons', 'Water-resistant natural finish']
  },
  {
    id: 'p8',
    name: 'VERAFIL Cashmere Knit Sweater',
    tagline: 'Weightless warmth.',
    description: 'Ultra-fine Grade A Mongolian cashmere sweater in a relaxed, architectural silhouette.',
    longDescription: 'Spun from ethically gathered single-origin Mongolian cashmere fibers, this sweater delivers supreme thermal balance without bulk. Designed with seamless knit technology and a mock neck that gently holds its form.',
    price: 320,
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['100% Grade A Mongolian Cashmere', 'Seamless 3D-Knit Construction', 'Breathable All-Season Gauge']
  },
  {
    id: 'p9',
    name: 'VERAFIL Vegetable-Tanned Tote',
    tagline: 'Structured quiet luxury.',
    description: 'Full-grain Tuscan leather tote with suede interior lining and dedicated tablet slot.',
    longDescription: 'Handmade by master artisans in Tuscany using centuries-old bark tanning traditions. The leather absorbs sunlight and touch, deepening into a rich honey patina over time. Sized perfectly to carry the VERAFIL Canvas display.',
    price: 390,
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Full-Grain Tuscan Cowhide', 'Plush Micro-Suede Lining', 'Padded Tablet Compartment']
  },

  // Home & Kitchen
  {
    id: 'p4',
    name: 'VERAFIL Essence',
    tagline: 'Return to nature.',
    description: 'An air purifier that doubles as a sculpture. Whisper quiet, diffusing subtle natural scents while cleaning your space.',
    longDescription: 'Clean air is the foundation of a clear mind. VERAFIL Essence uses a moss-based bio-filter combined with HEPA technology to scrub pollutants from your home. It gently diffuses natural essential oils—cedar, bergamot, and rain—orchestrated to match the time of day.',
    price: 599,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.pexels.com/photos/8092420/pexels-photo-8092420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    gallery: [
        'https://images.pexels.com/photos/8092420/pexels-photo-8092420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Bio-HEPA Filter', 'Aromatherapy', 'Silent Night Mode']
  },
  {
    id: 'p5',
    name: 'VERAFIL Beam',
    tagline: 'Light that breathes.',
    description: 'Smart circadian lighting that follows the sun. Casts a warm, candle-like glow in the evenings.',
    longDescription: 'Artificial light disrupts our natural rhythms. VERAFIL Beam syncs with your local sunrise and sunset, providing cool, energizing light during the day and transitioning to a warm, amber glow free of blue light in the evening. Controls are touchless; a simple wave of the hand adjusts brightness.',
    price: 249,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=1000',
    gallery: [
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1540932296235-d84931b6370b?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Circadian Rhythm Sync', 'Warm Dimming', 'Touchless Control']
  },
  {
    id: 'p10',
    name: 'VERAFIL Ceramic Coffee Dripper & Kettle',
    tagline: 'The morning ritual.',
    description: 'Matte terracotta pour-over dripper and precision goose-neck kettle with solid walnut handle.',
    longDescription: 'Reclaim the quiet meditation of brewing. Cast from high-fired natural terracotta and stoneware clay, this pour-over set maintains optimal temperature. The precision-counterbalanced walnut handle delivers effortless flow control.',
    price: 185,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['High-Fired Terracotta & Stoneware', 'Solid Walnut Ergonomic Handle', 'Double-Wall Thermal Stability']
  },
  {
    id: 'p11',
    name: 'VERAFIL Sandstone Vessel Trio',
    tagline: 'Form meets utility.',
    description: 'A trio of minimalist culinary storage jars crafted from Kyoto sandstone with airtight oak lids.',
    longDescription: 'Created from coarse sandstone sourced from the mountains of Kyoto, these canisters keep spices, specialty coffee beans, and teas fresh while serving as sculptural centerpieces for your kitchen counter.',
    price: 145,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Kyoto Natural Sandstone', 'FSC-Certified White Oak Lids', 'Airtight Silicone Food-Safe Seals']
  },

  // Skincare
  {
    id: 'p12',
    name: 'VERAFIL Botanical Renewal Serum',
    tagline: 'Quiet nourishment.',
    description: 'Cold-pressed camellia seed, bakuchiol, and organic squalane elixir housed in biophotonic ultraviolet glass.',
    longDescription: 'Sourced from heirloom camellia groves in southern Japan, this lightweight restorative oil absorbs instantly without a greasy trace. Bakuchiol provides gentle, smoothing rejuvenation while strengthening your natural moisture barrier.',
    price: 85,
    category: 'Skincare',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-00959f6d1490?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1608248597359-00959f6d1490?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['100% Cold-Pressed Botanicals', 'Biophotonic Miron Glass Bottle', 'Hypoallergenic & Fragrance-Free']
  },
  {
    id: 'p13',
    name: 'VERAFIL Volcanic Mineral Clay Mask',
    tagline: 'Pure earthly detox.',
    description: 'Kyoto volcanic silt and organic matcha purifying treatment with handcrafted applicator brush.',
    longDescription: 'Formulated with ultra-fine mineral-rich clay harvested from dormant volcanic strata in Kyoto. It pulls deep impurities from pores while replenishing essential trace minerals and soothing delicate skin.',
    price: 65,
    category: 'Skincare',
    imageUrl: 'https://images.unsplash.com/photo-1567928815116-f36894c2598c?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1567928815116-f36894c2598c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Kyoto Volcanic Mineral Silt', 'Organic Ceremonial Uji Matcha', 'Includes Artisan Beechwood Brush']
  },

  // Eye Care
  {
    id: 'p14',
    name: 'VERAFIL Hydro-Peptide Eye Balm',
    tagline: 'Rest for tired gaze.',
    description: 'De-puffing green coffee peptide infusion with a chilled ceramic cooling contour applicator.',
    longDescription: 'Specially developed for modern digital fatigue. Micro-encapsulated peptides and organic green tea extract diminish fine lines and morning puffiness, while the ergonomic sculpted ceramic tip delivers a restorative chilled lymphatic massage.',
    price: 72,
    category: 'Eye Care',
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Triple Peptide Complex', 'Ergonomic Cooling Ceramic Tip', 'Ophthalmologist Tested']
  },
  {
    id: 'p15',
    name: 'VERAFIL Circadian Amber Eye Frames',
    tagline: 'Protect your visual rhythm.',
    description: 'Hand-carved plant bio-acetate frames featuring premium circadian blue-light selective lenses.',
    longDescription: 'Engineered to preserve melatonin synthesis and eliminate digital eye strain without clinical yellow distortion. Hand-polished Italian bio-acetate frames fit comfortably for day-long work and quiet evening unwinding.',
    price: 165,
    category: 'Eye Care',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Italian Cellulose Bio-Acetate', '99.8% HEV Blue Light Blocking', 'Anti-Reflective Hydrophobic Coating']
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
    {
        id: 1,
        title: "The Psychology of Texture",
        date: "April 12, 2025",
        excerpt: "Why our fingertips crave natural surfaces in a world of glass and plastic.",
        image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=1000",
        content: React.createElement(React.Fragment, null,
            React.createElement("p", { className: "mb-6 first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-[#5D5A53]" },
                "We live in a frictionless world. Our phones are smooth glass, our laptops polished aluminum, our countertops engineered quartz. There is no resistance, no grit, no grain. And yet, our biology craves it."
            ),
            React.createElement("p", { className: "mb-8 text-[#5D5A53]" },
                "The fingertips are among the most densely innervated parts of the human body. They are designed to read the story of an object—its age, its origin, its temperature. When we deny them this input, we experience a subtle form of sensory deprivation."
            ),
            React.createElement("blockquote", { className: "border-l-2 border-[#2C2A26] pl-6 italic text-xl text-[#2C2A26] my-10 font-serif" },
                "\"To touch is to know. To feel is to be grounded.\""
            ),
            React.createElement("p", { className: "mb-6 text-[#5D5A53]" },
                "At VERAFIL, we design for the hand as much as for the eye. We choose materials that have a voice. Sandstone that warms under your palm. Fabric that has a weave you can trace. Wood that remembers the forest."
            )
        )
    },
    {
        id: 2,
        title: "Living with Less",
        date: "March 28, 2025",
        excerpt: "A conversation with architect Hiroshi Nakamura on the art of empty space.",
        image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1000",
        content: React.createElement(React.Fragment, null,
            React.createElement("p", { className: "mb-6 text-[#5D5A53]" },
                "Emptiness is not nothing. In Japanese architecture, the concept of ",
                React.createElement("em", null, "Ma"),
                " refers to the space between things—the pause that gives shape to the whole."
            ),
            React.createElement("p", { className: "mb-8 text-[#5D5A53]" },
                "\"We tend to fill our lives with noise,\" Nakamura says, sipping tea in his studio overlooking the rain-slicked streets of Kyoto. \"We buy more devices to save time, but we end up with less time than ever. True luxury is the absence of intrusion.\""
            ),
            React.createElement("div", { className: "my-12 p-8 bg-[#EBE7DE] font-serif text-[#2C2A26] italic text-center" },
                React.createElement("p", null, "The room is empty"),
                React.createElement("p", null, "But full of light."),
                React.createElement("p", null, "The mind is quiet"),
                React.createElement("p", null, "But full of thought."),
                React.createElement("p", null, "This is the weight"),
                React.createElement("p", null, "Of living with less.")
            ),
            React.createElement("p", { className: "mb-6 text-[#5D5A53]" },
                "This philosophy drives every curve of our new collection. We asked ourselves: what can we remove? How much can we take away until only the essential remains?"
            )
        )
    },
    {
        id: 3,
        title: "Spring Moodboard",
        date: "March 15, 2025",
        excerpt: "Notes from the design studio: morning mist, wet stone, and pale linen.",
        image: "https://images.unsplash.com/photo-1516834474-48c0abc2a902?auto=format&fit=crop&q=80&w=1000",
        content: React.createElement(React.Fragment, null,
            React.createElement("p", { className: "mb-6 text-[#5D5A53]" },
                "Spring in the studio is a time of awakening. The light shifts from the harsh, low angles of winter to a softer, diffused glow. We find ourselves drawn to paler tones—the grey of wet pavement, the cream of unbleached linen, the dusty green of sage."
            ),
            React.createElement("p", { className: "mb-8 text-[#5D5A53]" },
                "Our moodboard this month is a study in softness. It is about the transition state—neither cold nor hot, neither dark nor bright. It is the dawn of the year."
            ),
             React.createElement("div", { className: "my-12 p-8 bg-[#2C2A26] text-[#F5F2EB] font-serif italic text-center" },
                React.createElement("p", null, "Green sprout pushing through"),
                React.createElement("p", null, "Grey stone cold against the skin"),
                React.createElement("p", null, "The sun warms the air.")
            )
        )
    }
];

export const BRAND_NAME = 'VERAFIL';
export const PRIMARY_COLOR = 'stone-900'; 
export const ACCENT_COLOR = 'stone-500';