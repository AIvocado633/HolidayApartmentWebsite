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
  'Gemütliche Souterrainwohnung in Kleinsassen bei Hofbieber, mitten in der Rhön. Natur pur, frische Luft und echte Ruhe. Euer Zuhause auf Zeit.';

// The base rate for every night, all year. If seasonal pricing is ever wanted,
// this is the constant that turns into a lookup by date.
//
// Endreinigung is inside this rate, so there is no separate cleaning line
// anywhere. The AGB says so in as many words; do not introduce a cleaning fee
// without changing that section too.
export const PRICE_PER_NIGHT_EUR = 65;

// What the guest selector offers and what the flat actually sleeps.
export const MAX_GUESTS = 4;

// The base rate covers two people; every further person adds a surcharge. That
// surcharge is per night rather than once per stay, because the base rate is
// per night and two prices in different units cannot be added into one total
// without the calendar's breakdown quietly stopping making sense. A week for
// four therefore costs 7 × (65 + 2 × 10), not 7 × 65 + 2 × 10.
//
// § 3 of the AGB spells out the same arithmetic in words, so neither number
// moves without that section being rewritten to match.
export const GUESTS_INCLUDED_IN_BASE_PRICE = 2;
export const EXTRA_GUEST_PER_NIGHT_EUR = 10;

// A full flat, per night. The JSON-LD publishes the span from the base rate up
// to this one, and the AGB quotes it as its worked example — both derive it
// rather than restating 85, which would be a third place to forget.
export const MAX_PRICE_PER_NIGHT_EUR =
  PRICE_PER_NIGHT_EUR +
  (MAX_GUESTS - GUESTS_INCLUDED_IN_BASE_PRICE) * EXTRA_GUEST_PER_NIGHT_EUR;

// How far ahead the price calendar lets guests look.
export const BOOKABLE_MONTHS_AHEAD = 12;

// Levied by the Gemeinde Hofbieber and collected from guests on its behalf, so
// it sits outside the nightly rate and outside the cancellation base — a stay
// that does not happen incurs no Tourismusabgabe.
//
// The unit is the Übernachtung, not the calendar day: a stay touches one more
// day than it has nights, so "pro Person und Tag" would overstate every total by
// a night. The AGB, the price calendar and the contact details all quote
// TOURISMUSABGABE_UNIT verbatim, so the wording changes in one place.
export const TOURISMUSABGABE_PER_PERSON_PER_NIGHT_EUR = 1;
export const TOURISMUSABGABE_UNIT = 'pro Person pro Übernachtung';

// The terms below are quoted in the booking form, the AGB and the JSON-LD
// alike. They live here because three copies of "ab 15:00 Uhr" drift apart the
// first time one of them is edited, and an AGB that contradicts the booking
// form is worse than no AGB at all.
//
// Arrival is a window, departure only an upper bound: the key changes hands in
// person, so somebody has to be there to hand it over, whereas leaving needs
// nobody present. That asymmetry is why check-in has two times and check-out
// one, and why the two are listed apart rather than as a single "15:00 / 10:00"
// line.
//
// Bare times, without "Uhr": the JSON-LD needs them machine-readable, and the
// German pages add the unit themselves.
export const CHECK_IN_FROM = '15:00';
export const CHECK_IN_UNTIL = '19:00';
export const CHECK_OUT_UNTIL = '10:00';

// When the transfer has to be credited, and how close to arrival that route
// stops being realistic at all. Both count back from the arrival day, never from
// the invoice date: a deadline anchored to the invoice falls due months ahead
// for a stay booked early, which would park the full price with us right through
// the free-cancellation window in § 6 and turn every free cancellation into a
// refund somebody has to make by hand.
//
// The two numbers measure different things and must not be collapsed into one.
// The first is a deadline for the money, the second a threshold on the
// confirmation date, and a SEPA transfer needs a banking day to clear. Setting
// them equal leaves a band of bookings nominally on the transfer route with a
// deadline they cannot meet, so the second stays comfortably above the first.
// Confirmations inside it fall back to cash at the key handover. The AGB says
// all of this in words, so a change here needs that section read again.
export const PAYMENT_DUE_DAYS_BEFORE_ARRIVAL = 3;
export const CASH_ONLY_WITHIN_DAYS = 7;

// The two ways a stay can be paid for. The AGB prints them in full, the enquiry
// form offers them as a choice and the guest's pick travels in the enquiry mail,
// so one array feeds all three. An AGB that names a payment route the form does
// not offer is the same drift the constants above exist to prevent.
//
// `description` is the AGB's wording, `hint` the single line that fits under a
// radio button. They are two lengths of the same statement — changing one means
// changing the other.
export type PaymentMethodId = 'ueberweisung' | 'barzahlung';

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  description: string;
  hint: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'ueberweisung',
    label: 'Überweisung',
    description: `Zahlbar bis spätestens ${PAYMENT_DUE_DAYS_BEFORE_ARRIVAL} Tage vor Anreise. Maßgeblich ist der Zahlungseingang auf unserem Konto. Wann ihr bucht, ändert daran nichts. Liegen zwischen Buchungsbestätigung und Anreise weniger als ${CASH_ONLY_WITHIN_DAYS} Tage, bitten wir um Direktüberweisung oder Barzahlung bei Anreise.`,
    hint: `Rechnung mit der Buchungsbestätigung, zahlbar bis ${PAYMENT_DUE_DAYS_BEFORE_ARRIVAL} Tage vor Anreise.`,
  },
  {
    id: 'barzahlung',
    label: 'Barzahlung bei Anreise',
    description:
      'Der Gesamtbetrag wird bei der Schlüsselübergabe in bar beglichen.',
    hint: 'Zahlung in bar bei der Schlüsselübergabe.',
  },
];

// Where the enquiry form's radio group starts. The AGB treats the invoice as the
// standard route and cash as the alternative, so the form does too.
export const DEFAULT_PAYMENT_METHOD_ID: PaymentMethodId = 'ueberweisung';

// The enquiry mail carries the label rather than the id: the people reading it
// are looking at a mail client, not at this file.
export const paymentMethodLabel = (id: PaymentMethodId): string =>
  PAYMENT_METHODS.find((method) => method.id === id)?.label ?? id;

// The cancellation scale. Percentages apply to the accommodation price only.
//
// A lump-sum cancellation charge only holds up if it stays below the damage
// typically to be expected and if the guest may prove that less or none
// occurred (§ 309 Nr. 5 BGB). Both of those are why the top tier stops at 80 %
// rather than the industry's usual 90 %: Endreinigung, heating and electricity
// are all genuinely saved when nobody arrives. Raising these numbers without
// re-reading that section of the AGB risks voiding the clause outright.
//
// The tiers have to tile the whole timeline without a hole: every day before
// arrival must land in exactly one of them. The free tier is therefore inclusive
// of its own day ("14 Tage oder mehr", not "mehr als 14"), which is also how the
// calendar and the contact section read it — "kostenlos bis 14 Tage vor Anreise"
// is inclusive in German. Keep the labels derived from the constants so raising
// a threshold cannot leave a day unassigned again.
export const FREE_CANCELLATION_DAYS = 14;
const REDUCED_FEE_FROM_DAYS = 7;

export type CancellationTier = {
  label: string;
  sharePercent: number;
};

export const CANCELLATION_TIERS: CancellationTier[] = [
  {
    label: `${FREE_CANCELLATION_DAYS} Tage oder mehr vor Anreise`,
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
export const AGB_LAST_UPDATED = '2026-08-18';
export const PRIVACY_LAST_UPDATED = '2026-08-18';
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
