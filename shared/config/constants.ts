// Application Constants & Brand Parameters

export const RESTAURANT_BRAND = {
  name: "Tronx",
  tagline: "Good Food Brighter Moods",
  storyHeading: "Crafted with passion. Served with purpose.",
  storySubheading: "Experience a world of flavors crafted with passion and the freshest ingredients.",
  address: "100 Artisan Boulevard, Culinary Quarter",
  phone: "+1 (555) 321-4567",
  whatsapp: "+15553214567",
  email: "concierge@tronx.com",
  currency: "INR",
  currencySymbol: "₹",
  defaultTaxRate: 0.085, // 8.5%
  defaultDeliveryFee: 12.00,
  freeDeliveryThreshold: 120.00,
  operatingHours: "Tue - Sun: 16:30 - 23:30",
};

export const SEATING_SECTIONS = [
  { id: 'MAIN_DINING', name: 'Main Dining Sanctuary', desc: 'Warm cinematic atmosphere with bespoke brass chandeliers' },
  { id: 'CHEFS_COUNTER', name: "Chef's Artisanal Counter", desc: 'Intimate front-row culinary craftsmanship' },
  { id: 'TERRACE', name: 'Botanical Courtyard', desc: 'Heated open-air pavilion under ambient lanterns' },
  { id: 'PRIVATE_VAULT', name: "Founder's Private Suite", desc: 'Secluded VIP dining salon (Up to 14 guests)' },
] as const;
