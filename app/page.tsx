import Hero from '@/components/Hero';
import Amenities from '@/components/Amenities';
import Gallery from '@/components/Gallery';
import PricingCalendar from '@/components/PricingCalendar';
import ContactForm from '@/components/ContactForm';
import BookingDatesProvider from '@/components/BookingDatesProvider';
import { AMENITY_FEATURES } from '@/lib/amenities';
import {
  ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  PRICE_PER_NIGHT_EUR,
  PROPERTY_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
} from '@/lib/site';

// Structured data, so Search reads the property's details from here rather than
// inferring them from the page copy.
//
// This does not line up with a Google Business Profile, despite the overlap in
// fields: Google's eligibility rules exclude rental properties without staff on
// site, so a Maps entry for this flat is unlikely ever to exist.
const LODGING_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: PROPERTY_NAME,
  description: SITE_DESCRIPTION,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og.jpg`,
  telephone: CONTACT_PHONE,
  email: CONTACT_EMAIL,
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
