'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useBookingDates } from '@/components/BookingDatesProvider';
import { BOOKABLE_MONTHS_AHEAD, PRICE_PER_NIGHT_EUR } from '@/lib/site';
import {
  MONTH_NAMES,
  WEEKDAY_LABELS,
  buildIsoDate,
  daysInMonth,
  firstWeekdayOfMonth,
  formatEuros,
  formatGermanDate,
  formatGermanDateLong,
  nightsBetween,
  toIsoDate,
} from '@/lib/dates';

type MonthGridProps = {
  year: number;
  month: number;
  today: string;
  lastSelectable: string;
  checkIn: string;
  checkOut: string;
  onSelect: (isoDate: string) => void;
};

const MonthGrid = ({
  year,
  month,
  today,
  lastSelectable,
  checkIn,
  checkOut,
  onSelect,
}: MonthGridProps): React.JSX.Element => {
  const leadingBlanks = firstWeekdayOfMonth(year, month);
  const dayCount = daysInMonth(year, month);

  return (
    <div className="flex flex-col gap-3">
      <p className="font-body text-sm font-semibold text-accent text-center">
        {MONTH_NAMES[month]} {year}
      </p>

      <div className="grid grid-cols-7 gap-1" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center font-body text-xs font-semibold text-warm-500 uppercase tracking-wider py-1"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }, (_, index) => (
          <div key={`blank-${index}`} className="aspect-square" />
        ))}

        {Array.from({ length: dayCount }, (_, index) => {
          const day = index + 1;
          const isoDate = buildIsoDate(year, month, day);

          const isSelectable = isoDate >= today && isoDate <= lastSelectable;
          const isCheckIn = isoDate === checkIn;
          const isCheckOut = isoDate === checkOut;
          const isBetween =
            checkIn !== '' &&
            checkOut !== '' &&
            isoDate > checkIn &&
            isoDate < checkOut;

          const edgeClasses = 'bg-accent text-cream font-semibold';
          const betweenClasses = 'bg-warm-200 text-accent';
          const openClasses =
            'bg-white text-accent hover:bg-warm-100 hover:text-accent';
          const blockedClasses = 'text-warm-300 cursor-not-allowed';

          const stateClasses = !isSelectable
            ? blockedClasses
            : isCheckIn || isCheckOut
              ? edgeClasses
              : isBetween
                ? betweenClasses
                : openClasses;

          const roleLabel = isCheckIn
            ? ' – als Anreise gewählt'
            : isCheckOut
              ? ' – als Abreise gewählt'
              : '';

          return (
            <button
              key={isoDate}
              type="button"
              disabled={!isSelectable}
              onClick={() => onSelect(isoDate)}
              aria-pressed={isCheckIn || isCheckOut || isBetween}
              aria-label={`${formatGermanDateLong(isoDate)}${roleLabel}`}
              className={`aspect-square flex items-center justify-center font-body text-sm transition-colors duration-150 ${stateClasses}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const PricingCalendar = (): React.JSX.Element => {
  const { checkIn, checkOut, setCheckIn, setCheckOut, clearDates } =
    useBookingDates();

  // Resolved after mount. The page is prerendered at build time, so deriving the
  // visible months from a build-time "today" would both bake in a stale month
  // and trip a hydration mismatch once the build is a few days old.
  const [today, setToday] = useState<string>('');
  const [monthOffset, setMonthOffset] = useState<number>(0);

  useEffect(() => {
    setToday(toIsoDate(new Date()));
  }, []);

  const { months, lastSelectable, canGoBack, canGoForward } = useMemo(() => {
    if (today === '') {
      return {
        months: [],
        lastSelectable: '',
        canGoBack: false,
        canGoForward: false,
      };
    }

    const now = new Date(`${today}T00:00:00`);
    const baseYear = now.getFullYear();
    const baseMonth = now.getMonth();

    // A second grid appears from `lg` up, so the window can run one month past
    // the offset. Both are clamped to the bookable range.
    const visible = [0, 1].map((step) => {
      const cursor = new Date(baseYear, baseMonth + monthOffset + step, 1);
      return { year: cursor.getFullYear(), month: cursor.getMonth() };
    });

    const lastDate = new Date(baseYear, baseMonth + BOOKABLE_MONTHS_AHEAD + 1, 0);

    return {
      months: visible,
      lastSelectable: toIsoDate(lastDate),
      canGoBack: monthOffset > 0,
      canGoForward: monthOffset < BOOKABLE_MONTHS_AHEAD - 1,
    };
  }, [today, monthOffset]);

  const handleSelect = (isoDate: string): void => {
    // First click, a click once a range is already complete, or a click at or
    // before the current arrival all begin a new stay. Anything else closes the
    // open one.
    const startsNewStay = checkIn === '' || checkOut !== '' || isoDate <= checkIn;

    if (startsNewStay) {
      // Clearing first matters for the completed-range case: setCheckIn on its
      // own only drops a departure that falls on or before the new arrival, so
      // clicking inside a finished range would silently narrow it instead of
      // starting over.
      clearDates();
      setCheckIn(isoDate);
      return;
    }

    setCheckOut(isoDate);
  };

  const nights =
    checkIn !== '' && checkOut !== '' ? nightsBetween(checkIn, checkOut) : 0;
  const total = nights * PRICE_PER_NIGHT_EUR;

  return (
    <section
      id="pricing"
      className="py-20 md:py-28 bg-cream"
      aria-labelledby="pricing-heading"
    >
      <div className="section-container section-padding">
        <header className="flex flex-col items-center text-center gap-4 mb-14">
          <p className="label-overline">Preise &amp; Zeitraum</p>
          <h2 id="pricing-heading" className="heading-lg max-w-xl">
            {formatEuros(PRICE_PER_NIGHT_EUR)} pro Nacht
          </h2>
          <p className="font-body text-base text-accent-muted max-w-lg leading-relaxed">
            Der gleiche Preis das ganze Jahr über, für bis zu vier Personen
            inklusive Bettwäsche und Handtüchern. Sucht euch unten euren
            Zeitraum aus – die Daten werden direkt in die Anfrage übernommen.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-10 items-start">
          {/* Calendar */}
          <div className="bg-white border border-beige p-5 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <button
                type="button"
                onClick={() => setMonthOffset((previous) => previous - 1)}
                disabled={!canGoBack}
                className="p-2 text-accent-muted hover:text-accent disabled:text-warm-300 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Vorherigen Monat anzeigen"
              >
                <ChevronLeft size={20} />
              </button>
              <p className="font-body text-xs uppercase tracking-widest text-warm-500">
                Zeitraum wählen
              </p>
              <button
                type="button"
                onClick={() => setMonthOffset((previous) => previous + 1)}
                disabled={!canGoForward}
                className="p-2 text-accent-muted hover:text-accent disabled:text-warm-300 disabled:cursor-not-allowed transition-colors duration-200"
                aria-label="Nächsten Monat anzeigen"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {months.length === 0 ? (
              // Placeholder until `today` resolves on the client, so the section
              // does not jump in height on hydration.
              <div className="min-h-[19rem]" aria-hidden="true" />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {months.map(({ year, month }, index) => (
                  <div
                    key={`${year}-${month}`}
                    className={index === 1 ? 'hidden lg:block' : undefined}
                  >
                    <MonthGrid
                      year={year}
                      month={month}
                      today={today}
                      lastSelectable={lastSelectable}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onSelect={handleSelect}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 pt-5 border-t border-beige text-xs font-body text-warm-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-accent inline-block" aria-hidden="true" />
                An- und Abreise
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-warm-200 inline-block" aria-hidden="true" />
                Gewählter Zeitraum
              </span>
            </div>
          </div>

          {/* Summary */}
          <aside
            className="bg-white border border-beige p-6 flex flex-col gap-5 lg:sticky lg:top-28"
            aria-label="Preisübersicht"
          >
            <h3 className="heading-sm text-accent">Euer Zeitraum</h3>

            <dl className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <dt className="font-body text-sm text-accent-muted">Anreise</dt>
                <dd className="font-body text-sm text-accent">
                  {checkIn === '' ? '–' : formatGermanDate(checkIn)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-body text-sm text-accent-muted">Abreise</dt>
                <dd className="font-body text-sm text-accent">
                  {checkOut === '' ? '–' : formatGermanDate(checkOut)}
                </dd>
              </div>
            </dl>

            <div
              className="pt-4 border-t border-beige flex flex-col gap-3"
              aria-live="polite"
            >
              {nights > 0 ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-body text-sm text-accent-muted">
                      {nights} {nights === 1 ? 'Nacht' : 'Nächte'} ×{' '}
                      {formatEuros(PRICE_PER_NIGHT_EUR)}
                    </span>
                    <span className="font-heading text-2xl font-semibold text-accent">
                      {formatEuros(total)}
                    </span>
                  </div>
                  <p className="font-body text-xs text-warm-500 leading-relaxed">
                    Zzgl. Kurtaxe von 1 € pro Person und Tag. Kostenlose
                    Stornierung bis 14 Tage vor Anreise.
                  </p>
                </>
              ) : (
                <p className="font-body text-sm text-accent-muted leading-relaxed">
                  {checkIn === ''
                    ? 'Wählt im Kalender euren Anreisetag.'
                    : 'Wählt jetzt noch den Abreisetag.'}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="#contact"
                className="btn-primary w-full justify-center gap-2"
              >
                <CalendarDays size={16} aria-hidden="true" />
                Verfügbarkeit anfragen
              </Link>
              {(checkIn !== '' || checkOut !== '') && (
                <button
                  type="button"
                  onClick={clearDates}
                  className="btn-ghost w-full justify-center text-xs"
                >
                  Auswahl zurücksetzen
                </button>
              )}
            </div>

            <p className="flex items-start gap-2 font-body text-xs text-warm-500 leading-relaxed">
              <Check
                size={13}
                className="mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              Der Kalender zeigt keine Belegung. Ob euer Zeitraum frei ist,
              bestätigen wir euch mit der Antwort auf eure Anfrage.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PricingCalendar;
