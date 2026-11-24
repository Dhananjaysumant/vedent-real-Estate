export const SITE = {
  name: 'Vanguard Estates',
  tagline: 'The Art of Living',
  url: 'https://vanguard-estates.example',
  locale: 'en_US',
  description:
    'Vanguard Estates creates exceptional luxury residences in extraordinary landscapes. Explore the architecture, the residences and an interactive 3D property experience.',
  ogImage: '/assets/images/og-image.png',
} as const;

export const CONTACT = {
  email: 'enquiries@vanguard-estates.example',
  phone: '+1 (310) 555-0142',
  phoneHref: 'tel:+13105550142',
  addressLines: ['Vanguard Estates', '228 Ocean Ridge Drive', 'Malibu, California 90265'],
  note: 'Demonstration contact details. This is not a real business address or telephone number.',
  offices: [
    { city: 'Los Angeles', region: 'California', country: 'United States' },
    { city: 'Sydney', region: 'New South Wales', country: 'Australia' },
    { city: 'Toronto', region: 'Ontario', country: 'Canada' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/' },
  ],
} as const;

export const DEMO_NOTE =
  'Vanguard Estates is a fictional brand created for this interactive design demonstration. Residences, locations, prices, availability and studio information are illustrative only and do not constitute an offer, listing or professional advice.';

export const ILLUSTRATIVE_PRICING_NOTE =
  'Illustrative demonstration pricing. Not a real listing, offer or statement of availability.';
