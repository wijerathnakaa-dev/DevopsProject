/**
 * ChaCeylon Manufactures — single source of truth for company details.
 * Taken from the official ChaCeylon company website project.
 * Update values here and every page (Footer, About & Contact, Home) picks them up.
 */
const company = {
  name: 'ChaCeylon Manufactures',
  shortName: 'ChaCeylon',
  brandLine: "Nature's Blend",
  heroTitle: "Nature's Blend for Modern Living",
  heroSubtitle: 'Natural Food & Beverage Manufacturing from Sri Lanka',
  badge: 'Premium Herbal Export Brand',
  tagline: 'Natural • Healthy • Traditional • Trusted',
  summary:
    'Premium herbal and beverage products manufactured with traditional Sri Lankan ingredients and export-quality standards.',
  intro:
    'ChaCeylon Manufactures is a Sri Lankan food and beverage manufacturing company focused on producing natural, wellness-oriented and export-quality products for local and international markets.',

  // Contact details
  email: 'ChaceylonManufactures@gmail.com',
  // TODO: add the real numbers (format: +94771234567). Left empty so no fake number is shown on the site.
  phone: '',
  whatsapp: '',
  address: 'No 269, Walawwegama, Vijithapura, Sri Lanka',
  region: 'Anuradhapura, Sri Lanka',
  mapUrl: 'https://maps.google.com/maps?q=ChaCeylon,+No+269,+Walawwegama,+Vijithapura,+Sri+Lanka',
  hours: [
    { days: 'Mon – Fri', time: '9:00 AM – 6:00 PM' },
    { days: 'Saturday', time: '9:00 AM – 2:00 PM' },
  ],
  hoursNote: 'Local Sri Lankan time',

  story: [
    'ChaCeylon Manufactures was founded with a vision to manufacture natural, wellness-oriented, and export-quality food and beverage products inspired by Sri Lanka’s rich agricultural and herbal heritage.',
    'Located in Anuradhapura, ChaCeylon focuses on combining traditional Sri Lankan ingredients with modern food processing and manufacturing methods to create reliable, high-quality products for local and international markets.',
    'Our product range includes herbal teas, moringa-based products, herbal powders, spices, flour products, natural beverages, snacks, and customized manufacturing solutions designed to meet evolving consumer and business needs.',
    'At ChaCeylon, we are committed to supporting sustainable local agriculture, maintaining consistent manufacturing standards, and delivering products that reflect quality, authenticity, and innovation.',
  ],
  mission:
    'To manufacture natural, high-quality food, beverage, herbal, and ingredient products using carefully selected Sri Lankan ingredients and modern production practices while supporting sustainable agriculture and serving both local and international markets.',
  vision:
    'To become a trusted Sri Lankan manufacturing brand recognized for natural products, export-quality standards, innovation, and reliable food and beverage solutions.',

  strengths: [
    { title: 'Quality Ingredients', text: 'Carefully selected Sri Lankan herbs, spices, fruits and natural ingredients sourced with quality and consistency in mind.' },
    { title: 'Modern Manufacturing', text: 'Food and beverage products processed using hygienic manufacturing practices and controlled production methods.' },
    { title: 'Export-Oriented Standards', text: 'Products developed to support both local and international market requirements with a focus on quality and reliability.' },
    { title: 'Tradition Inspired Innovation', text: 'Combining traditional Sri Lankan ingredient knowledge with modern food and beverage manufacturing approaches.' },
    { title: 'Business Solutions', text: 'Supporting retail, wholesale, bulk supply, OEM, and private-label manufacturing requirements for diverse business needs.' },
  ],

  services: [
    { title: 'Wholesale & Bulk Orders', text: 'Contact us for wholesale orders, industrial supply, and bulk ingredient requirements.' },
    { title: 'OEM & Private Label', text: 'Looking to develop your own product brand? We support customized manufacturing solutions.' },
    { title: 'Export Partnerships', text: 'Interested in international distribution or export partnerships? We welcome business collaborations.' },
  ],

  // Product range offered by ChaCeylon Manufactures
  productRange: [
    { name: 'Herbal & Tea Products', text: 'Moringa tea, Ranawara tea, Belimal tea, herbal blends and wellness teas.' },
    { name: 'Herbal & Fruit Powders', text: 'Moringa powder, curry leaf powder, fruit powders and natural ingredient powders.' },
    { name: 'Flour & Ingredient Products', text: 'Kurakkan flour, banana flour, sweet potato flour and blended flour solutions.' },
    { name: 'Spice & Seasoning Products', text: 'Traditional spice blends, herbal spice products and seasoning solutions.' },
    { name: 'Snacks & Value-Added Foods', text: 'Banana chips, cassava chips, root-based snacks and other processed food products.' },
    { name: 'Beverage Products', text: 'Herbal beverages, iced tea, wellness drinks and plant-based beverages.' },
    { name: 'Bulk & Industrial Supply', text: 'Wholesale powders, flours, herbs, spices and raw materials for manufacturers.' },
  ],
};

export const phoneHref = company.phone ? `tel:${company.phone.replace(/\s+/g, '')}` : null;
export const whatsappHref = company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/[^\d]/g, '')}` : null;
export const emailHref = `mailto:${company.email}`;

export default company;
