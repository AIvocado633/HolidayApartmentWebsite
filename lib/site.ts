// Single source for the operator details. These appear in the Impressum, the
// footer and the contact section, and § 5 DDG expects the Impressum to carry the
// same reachable contact as the rest of the site — so they must not drift apart.

export const PROPERTY_NAME = 'Ferienwohnung Zum Biebertal';
export const OPERATOR_NAME = 'Stefan Weber';

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
