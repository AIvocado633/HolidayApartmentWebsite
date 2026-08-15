import Hero from '@/components/Hero';
import Amenities from '@/components/Amenities';
import Gallery from '@/components/Gallery';
import ContactForm from '@/components/ContactForm';
import { ADDRESS, PROPERTY_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/site';

// Structured data, so Google can tie this site to the Google Business Profile
// entry rather than treating them as unrelated.
//
// Deliberately incomplete: `telephone` and `email` are missing because the values
// in lib/site.ts are still placeholders, and feeding a fake number to Google is
// worse than feeding it nothing. Add both here once they are real. `priceRange`
// is absent for the same reason — the site quotes no prices yet.
const LODGING_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: PROPERTY_NAME,
  description: SITE_DESCRIPTION,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS.street,
    postalCode: ADDRESS.postalCode,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.region,
    addressCountry: 'DE',
  },
  numberOfRooms: 1,
  checkinTime: '15:00',
  checkoutTime: '10:00',
};

const HomePage = (): React.JSX.Element => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LODGING_JSON_LD) }}
      />
      <Hero />
      <Amenities />
      <Gallery />
      <ContactForm />
    </>
  );
};

export default HomePage;
