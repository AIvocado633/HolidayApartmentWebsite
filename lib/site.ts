// Single source for the operator details. These appear in the Impressum, the
// footer and the contact section, and § 5 DDG expects the Impressum to carry the
// same reachable contact as the rest of the site — so they must not drift apart.

export const PROPERTY_NAME = 'Ferienwohnung Zum Biebertal';
export const OPERATOR_NAME = 'Stefan Weber';

// Absolute base for canonical URLs, the sitemap, robots.txt, the social preview
// image and the JSON-LD. It has to include the basePath, because on GitHub Pages
// the site is served from a subdirectory rather than the domain root.
//
// Moving to a custom domain means changing this to the bare domain AND removing
// `basePath` from next.config.js — a custom domain serves from the root, so
// leaving the basePath in place would break every asset on the site.
export const SITE_URL = 'https://aivocado633.github.io/HolidayApartmentWebsite';

export const SITE_DESCRIPTION =
  'Gemütliche Souterrainwohnung in Kleinsassen bei Hofbieber, mitten in der Rhön. Natur pur, frische Luft und echte Ruhe – euer Zuhause auf Zeit.';

// A single flat rate for every night, all year. If seasonal pricing is ever
// wanted, this is the constant that turns into a lookup by date — the calendar
// already prices each night individually rather than multiplying a total.
export const PRICE_PER_NIGHT_EUR = 65;

// How far ahead the price calendar lets guests look.
export const BOOKABLE_MONTHS_AHEAD = 12;

type PostalAddress = {
  street: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
};

export const ADDRESS: PostalAddress = {
  street: 'Sandroth 15',
  postalCode: '36145',
  city: 'Hofbieber/Kleinsassen',
  region: 'Hessen',
  country: 'Deutschland',
};

// TODO: both are still placeholders. An Impressum without a working e-mail
// address does not satisfy § 5 DDG, so these have to be real before launch.
export const CONTACT_EMAIL = 'hallo@XYZ-ferien.de';
export const CONTACT_PHONE = '+49 1234 567890';

export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;
export const CONTACT_PHONE_HREF = `tel:${CONTACT_PHONE.replace(/[^+\d]/g, '')}`;

export const ADDRESS_INLINE = `${ADDRESS.street}, ${ADDRESS.postalCode} ${ADDRESS.city}`;

// Street / postcode and town / country, the order a German postal address is
// written in and the one the Impressum has to use.
export const ADDRESS_LINES: string[] = [
  ADDRESS.street,
  `${ADDRESS.postalCode} ${ADDRESS.city}`,
  ADDRESS.country,
];
