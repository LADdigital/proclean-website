import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://www.procleanautoyakima.com';

const BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['AutoRepair', 'LocalBusiness'],
  '@id': `${BASE_URL}/#business`,
  name: 'Pro Clean Auto Detail Systems',
  url: BASE_URL,
  image: `${BASE_URL}/procleanteam.jpeg`,
  logo: `${BASE_URL}/Photoroom_20260213_195605.png`,
  telephone: '+1-509-454-9299',
  email: 'detailproclean@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1231 S 1st',
    addressLocality: 'Yakima',
    addressRegion: 'WA',
    postalCode: '98901',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 46.5958,
    longitude: -120.5115,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:30',
      closes: '17:30',
    },
  ],
  sameAs: [
    'https://www.facebook.com/ProCleanAutoDetail',
    'https://www.instagram.com/procleanautoyakima',
  ],
  priceRange: '$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Cash, Credit Card',
  description:
    "Pro Clean Auto Detail Systems is Yakima, WA's premier auto detailing shop with over 15 years of experience. We offer ceramic coating, paint correction, interior and exterior detailing, wheel restoration, paintless dent repair, rock chip repair, and more.",
  areaServed: [
    { '@type': 'City', name: 'Yakima', '@id': 'https://en.wikipedia.org/wiki/Yakima,_Washington' },
    { '@type': 'City', name: 'Selah' },
    { '@type': 'City', name: 'Union Gap' },
    { '@type': 'City', name: 'Terrace Heights' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Auto Detailing Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Ceramic Coating',
          description: 'Long-lasting ceramic paint protection with deep gloss finish.',
        },
        priceSpecification: { '@type': 'PriceSpecification', price: '600', priceCurrency: 'USD', minPrice: '600' },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Paint Correction',
          description: 'Remove swirls, scratches, and oxidation to restore paint clarity.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Interior Detailing',
          description: 'Deep interior cleaning, leather conditioning, and odor removal.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Exterior Detailing',
          description: 'Complete exterior wash, clay bar, polish, and paint sealant.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Paintless Dent Repair',
          description: 'Remove dents, dings, and hail damage without repainting.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wheel Restoration',
          description: 'Curb rash repair, deep cleaning, and protective wheel coating.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Rock Chip Repair',
          description: 'Professional windshield rock chip sealing to prevent cracking.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Paint Touchup',
          description: 'Color-matched chip and scratch repair to protect vehicle value.',
        },
      },
    ],
  },
};

const BREADCRUMB_MAP: Record<string, Array<{ name: string; path: string }>> = {
  '/': [{ name: 'Home', path: '/' }],
  '/about': [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ],
  '/services': [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ],
  '/gallery': [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
  ],
  '/contact': [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ],
  '/gift-card': [
    { name: 'Home', path: '/' },
    { name: 'Gift Cards', path: '/gift-card' },
  ],
};

function buildBreadcrumbSchema(pathname: string) {
  const crumbs = BREADCRUMB_MAP[pathname] ?? BREADCRUMB_MAP['/'];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${BASE_URL}${crumb.path}`,
    })),
  };
}

export default function SchemaMarkup() {
  const { pathname } = useLocation();
  const breadcrumbSchema = buildBreadcrumbSchema(pathname);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
