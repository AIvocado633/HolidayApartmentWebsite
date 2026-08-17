// Single source for the operator details. These appear in the Impressum, the
// footer and the contact section, and § 5 DDG expects the Impressum to carry the
// same reachable contact as the rest of the site — so they must not drift apart.

export const PROPERTY_NAME = 'Ferienwohnung Zum Biebertal';
export const OPERATOR_NAME = 'Stefan Weber';

// Absolute base for canonical URLs, the sitemap, robots.txt, the social preview
// image and the JSON-LD. No trailing slash — every caller adds its own path, so
// one here would double up.
//
// The apex is canonical, not www. GitHub Pages redirects www here on its own, and
// a canonical that pointed at the end of a redirect rather than its target is a
// contradiction crawlers have to resolve for us. Changing this to www means
// changing the custom domain in the repo's Pages settings to match.
export const SITE_URL = 'https://ferienwohnungzumbiebertal.de';

export const SITE_DESCRIPTION =
  'Gemütliche Souterrainwohnung in Kleinsassen bei Hofbieber, mitten in der Rhön. Natur pur, frische Luft und echte Ruhe – euer Zuhause auf Zeit.';

// A single flat rate for every night, all year. If seasonal pricing is ever
// wanted, this is the constant that turns into a lookup by date — the calendar
// already prices each night individually rather than multiplying a total.
//
// Endreinigung is inside this rate, so there is no separate cleaning line
// anywhere. The AGB says so in as many words; do not introduce a cleaning fee
// without changing that section too.
export const PRICE_PER_NIGHT_EUR = 65;

// How far ahead the price calendar lets guests look.
export const BOOKABLE_MONTHS_AHEAD = 12;

// Levied by the Gemeinde Hofbieber and collected from guests on its behalf, so
// it sits outside the nightly rate and outside the cancellation base — a stay
// that does not happen incurs no Kurtaxe.
export const KURTAXE_PER_PERSON_PER_DAY_EUR = 1;

// The terms below are quoted in the booking form, the price calendar and the
// AGB alike. They live here because three copies of "ab 15:00 Uhr" drift apart
// the first time one of them is edited, and an AGB that contradicts the booking
// form is worse than no AGB at all.
export const CHECK_IN_FROM = '15:00 Uhr';
export const CHECK_OUT_UNTIL = '10:00 Uhr';

// What the guest selector offers and what the flat actually sleeps.
export const MAX_GUESTS = 4;

// How long the invoice that goes out with the booking confirmation runs for.
// Capped by the arrival date in the AGB, so a booking made inside this window
// is simply due on arrival.
export const INVOICE_DUE_DAYS = 14;

// The cancellation scale. Percentages apply to the accommodation price only.
//
// A lump-sum cancellation charge only holds up if it stays below the damage
// typically to be expected and if the guest may prove that less or none
// occurred (§ 309 Nr. 5 BGB). Both of those are why the top tier stops at 80 %
// rather than the industry's usual 90 %: Endreinigung, heating and electricity
// are all genuinely saved when nobody arrives. Raising these numbers without
// re-reading that section of the AGB risks voiding the clause outright.
export const FREE_CANCELLATION_DAYS = 14;
const REDUCED_FEE_FROM_DAYS = 7;

export type CancellationTier = {
  label: string;
  sharePercent: number;
};

export const CANCELLATION_TIERS: CancellationTier[] = [
  {
    label: `Mehr als ${FREE_CANCELLATION_DAYS} Tage vor Anreise`,
    sharePercent: 0,
  },
  {
    label: `${FREE_CANCELLATION_DAYS - 1} bis ${REDUCED_FEE_FROM_DAYS} Tage vor Anreise`,
    sharePercent: 50,
  },
  {
    label: `Weniger als ${REDUCED_FEE_FROM_DAYS} Tage vor Anreise, am Anreisetag oder bei Nichtanreise`,
    sharePercent: 80,
  },
];

// When each legal text last changed in substance, as an ISO day. The pages print
// these as "Stand: August 2026" and the sitemap publishes the same days as
// <lastmod>, so a crawler and a guest are never told two different things.
//
// Bump one when a clause changes, not when the file is touched. A lastmod that
// moves on every build is one search engines learn to ignore, and the
// availability sync rebuilds this site several times a day.
export const AGB_LAST_UPDATED = '2026-08-16';
export const PRIVACY_LAST_UPDATED = '2026-08-16';
export const IMPRESSUM_LAST_UPDATED = '2026-08-16';

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

// Published in the Impressum, the footer, the contact section and the JSON-LD.
// § 5 DDG expects the Impressum to carry a contact that actually works, so both
// have to stay real.
//
// The address is also the login for the Google account behind the availability
// sync. That is public by necessity rather than by oversight — do not "fix" it by
// swapping in something else without changing the Impressum too.
export const CONTACT_EMAIL = 'FerienwohnungZumBiebertal@gmail.com';
export const CONTACT_PHONE = '+49 6657 1816';

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
