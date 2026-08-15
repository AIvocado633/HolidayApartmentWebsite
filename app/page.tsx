import Hero from '@/components/Hero';
import Amenities from '@/components/Amenities';
import Gallery from '@/components/Gallery';
import PricingCalendar from '@/components/PricingCalendar';
import ContactForm from '@/components/ContactForm';
import BookingDatesProvider from '@/components/BookingDatesProvider';
import { AMENITY_FEATURES } from '@/lib/amenities';
import {
  ADDRESS,
  PRICE_PER_NIGHT_EUR,
  PROPERTY_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
} from '@/lib/site';

// Structured data, so Google can tie this site to the Google Business Profile
// entry rather than treating them as unrelated.
//
// Deliberately incomplete: `telephone` and `email` are missing because the values
// in lib/site.ts are still placeholders, and feeding a fake number to Google is
// worse than feeding it nothing. Add both here once they are real.
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
  priceRange: `${PRICE_PER_NIGHT_EUR} €`,
  // The two house rules have their own booleans in schema.org, so they belong
  // here rather than as amenityFeature entries with `value: false`.
  petsAllowed: false,
  smokingAllowed: false,
  amenityFeature: AMENITY_FEATURES.map((name) => ({
    '@type': 'LocationFeatureSpecification',
    name,
    value: true,
  })),
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
      {/* The calendar and the enquiry form edit the same two dates, so they share
          one provider rather than holding a copy each. */}
      <BookingDatesProvider>
        <PricingCalendar />
        <ContactForm />
      </BookingDatesProvider>
    </>
  );
};

export default HomePage;
