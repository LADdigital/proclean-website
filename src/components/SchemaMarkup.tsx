export default function SchemaMarkup() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: 'Pro Clean Auto Detail Systems',
    image: '/procleanteam.jpeg',
    '@id': '',
    url: '',
    telephone: '509-454-9299',
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
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '16:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/ProCleanAutoDetail',
      'https://www.instagram.com/procleanautoyakima',
    ],
    priceRange: '$$',
    description:
      'Pro Clean Auto Detail Systems is Yakima, WA\'s premier auto detailing shop with over 15 years of experience. We offer ceramic coating, paint correction, interior and exterior detailing, wheel restoration, RV detailing, and boat detailing.',
    areaServed: {
      '@type': 'City',
      name: 'Yakima',
      '@id': 'https://en.wikipedia.org/wiki/Yakima,_Washington',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
