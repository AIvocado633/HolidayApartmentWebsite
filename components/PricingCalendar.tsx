import { Check, Tag } from 'lucide-react';

type SeasonTier = {
  id: string;
  label: string;
  dateRange: string;
  pricePerNight: number;
  minNights: number;
  highlights: string[];
  isMostPopular: boolean;
};

const SEASON_TIERS: SeasonTier[] = [
  {
    id: 'low',
    label: 'Nebensaison',
    dateRange: 'Nov – Mär (ohne Weihnachten)',
    pricePerNight: 65,
    minNights: 2,
    highlights: [
      'Ruhige Winterlandschaft',
      'Gemütliche Abende zuhause',
      'Wenig Trubel im Dorf',
    ],
    isMostPopular: false,
  },
  {
    id: 'mid',
    label: 'Zwischensaison',
    dateRange: 'Apr – Mai · Okt',
    pricePerNight: 80,
    minNights: 3,
    highlights: [
      'Frühlingswiesen und Vogelstimmen',
      'Ideales Wanderwetter',
      'Wenig Hochsaison-Betrieb',
    ],
    isMostPopular: false,
  },
  {
    id: 'high',
    label: 'Hauptsaison',
    dateRange: 'Jun – Sep',
    pricePerNight: 100,
    minNights: 5,
    highlights: [
      'Lange Sommerabende im Garten',
      'Beste Wanderbedingungen',
      'Wochenmärkte und Dorffeste',
    ],
    isMostPopular: true,
  },
  {
    id: 'festive',
    label: 'Weihnachten & Silvester',
    dateRange: '20. Dez – 6. Jan',
    pricePerNight: 115,
    minNights: 5,
    highlights: [
      'Stille Weihnachten auf dem Land',
      'Verschneite Rhön-Landschaft',
      'Silvester in der Natur',
    ],
    isMostPopular: false,
  },
];

// Static calendar data for a sample month (July)
const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const WEEK_OFFSET = 2; // July 1 starts on Tuesday (0=Mon)
const BOOKED_RANGES: [number, number][] = [
  [5, 12],
  [19, 26],
];
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const isDayBooked = (day: number): boolean =>
  BOOKED_RANGES.some(([start, end]) => day >= start && day <= end);

const isDayCheckInOut = (day: number): boolean =>
  BOOKED_RANGES.some(([start, end]) => day === start || day === end);

type PricingCardProps = {
  tier: SeasonTier;
};

const PricingCard = ({ tier }: PricingCardProps): React.JSX.Element => {
  return (
    <article
      className={`relative flex flex-col p-6 border transition-shadow duration-200 ${
        tier.isMostPopular
          ? 'border-accent bg-accent text-cream shadow-lg'
          : 'border-beige bg-white card'
      }`}
    >
      {tier.isMostPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 bg-warm-400 text-white text-xs font-semibold px-3 py-1 uppercase tracking-wider">
            <Tag size={10} />
            Beliebteste Wahl
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1 mb-4">
        <p
          className={`label-overline ${
            tier.isMostPopular ? 'text-cream/60' : ''
          }`}
        >
          {tier.label}
        </p>
        <p
          className={`font-body text-xs ${
            tier.isMostPopular ? 'text-cream/70' : 'text-warm-500'
          }`}
        >
          {tier.dateRange}
        </p>
      </div>

      <div className="flex items-baseline gap-1 mb-1">
        <span
          className={`font-heading text-4xl font-semibold ${
            tier.isMostPopular ? 'text-cream' : 'text-accent'
          }`}
        >
          €{tier.pricePerNight}
        </span>
        <span
          className={`font-body text-sm ${
            tier.isMostPopular ? 'text-cream/70' : 'text-warm-500'
          }`}
        >
          / night
        </span>
      </div>
      <p
        className={`font-body text-xs mb-6 ${
          tier.isMostPopular ? 'text-cream/60' : 'text-warm-400'
        }`}
      >
        Min. {tier.minNights} nights
      </p>

      <ul className="flex flex-col gap-2 flex-1" role="list">
        {tier.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2">
            <Check
              size={14}
              className={`mt-0.5 flex-shrink-0 ${
                tier.isMostPopular ? 'text-warm-300' : 'text-warm-500'
              }`}
              aria-hidden="true"
            />
            <span
              className={`font-body text-sm ${
                tier.isMostPopular ? 'text-cream/80' : 'text-accent-muted'
              }`}
            >
              {highlight}
            </span>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className={`mt-6 btn-outline w-full justify-center text-sm py-2.5 ${
          tier.isMostPopular
            ? 'border-cream/50 text-cream hover:bg-cream/10'
            : ''
        }`}
      >
        Anfragen
      </a>
    </article>
  );
};

const CalendarGrid = (): React.JSX.Element => {
  const totalCells = WEEK_OFFSET + CALENDAR_DAYS.length;
  const paddedCells = Math.ceil(totalCells / 7) * 7;

  return (
    <div className="bg-white border border-beige p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="heading-sm text-accent">July 2026</h3>
        <div className="flex items-center gap-4 text-xs font-body text-warm-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-warm-200 inline-block" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-white border border-beige inline-block" />
            Available
          </span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAY_LABELS.map((day) => (
          <div
            key={day}
            className="text-center font-body text-xs font-semibold text-warm-500 uppercase tracking-wider py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: paddedCells }, (_, cellIndex) => {
          const dayNumber = cellIndex - WEEK_OFFSET + 1;
          const isValidDay = dayNumber >= 1 && dayNumber <= 31;

          if (!isValidDay) {
            return <div key={`empty-${cellIndex}`} className="aspect-square" />;
          }

          const booked = isDayBooked(dayNumber);
          const checkInOut = isDayCheckInOut(dayNumber);

          return (
            <div
              key={dayNumber}
              className={`aspect-square flex items-center justify-center text-sm font-body transition-colors ${
                booked
                  ? checkInOut
                    ? 'bg-warm-300 text-accent font-semibold'
                    : 'bg-warm-200 text-warm-600'
                  : 'bg-cream hover:bg-beige-light text-accent cursor-pointer'
              }`}
              aria-label={`July ${dayNumber}${booked ? ' - Booked' : ' - Available'}`}
            >
              {dayNumber}
            </div>
          );
        })}
      </div>

      <p className="font-body text-xs text-warm-400 mt-4 text-center">
        Beispiel-Verfügbarkeit · Bitte Kontakt aufnehmen für genaue Daten
      </p>
    </div>
  );
};

const PricingCalendar = (): React.JSX.Element => {
  return (
    <section
      id="pricing"
      className="py-20 md:py-28 bg-cream"
      aria-labelledby="pricing-heading"
    >
      <div className="section-container section-padding">
        {/* Section header */}
        <header className="flex flex-col items-center text-center gap-4 mb-16">
          <p className="label-overline">Preise &amp; Verfügbarkeit</p>
          <h2 id="pricing-heading" className="heading-lg max-w-xl">
            Faire Preise, ehrliche Saisons
          </h2>
          <p className="font-body text-base text-accent-muted max-w-lg leading-relaxed">
            Alle Preise pro Nacht für bis zu 4 Personen inkl. Bettwäsche und
            Handtücher. Endreinigung und Kurtaxe kommen hinzu.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
          {/* Pricing tiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-3">
            {SEASON_TIERS.map((tier) => (
              <PricingCard key={tier.id} tier={tier} />
            ))}
          </div>

          {/* Calendar */}
          <div className="flex flex-col gap-4">
            <CalendarGrid />

            {/* Additional notes */}
            <ul className="flex flex-col gap-2 text-sm font-body text-accent-muted px-1">
              <li className="flex items-start gap-2">
                <Check
                  size={14}
                  className="text-warm-500 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                Check-in ab 15:00 Uhr · Check-out bis 10:00 Uhr
              </li>
              <li className="flex items-start gap-2">
                <Check
                  size={14}
                  className="text-warm-500 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                Kaution: 200 € (wird nach Abreise zurücküberwiesen)
              </li>
              <li className="flex items-start gap-2">
                <Check
                  size={14}
                  className="text-warm-500 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                50 % Anzahlung zur Buchungsbestätigung erforderlich
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCalendar;
