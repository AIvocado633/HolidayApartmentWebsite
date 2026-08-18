'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useBookingDates } from '@/components/BookingDatesProvider';
import {
  BOOKABLE_MONTHS_AHEAD,
  EXTRA_GUEST_PER_NIGHT_EUR,
  FREE_CANCELLATION_DAYS,
  GUESTS_INCLUDED_IN_BASE_PRICE,
  MAX_GUESTS,
  PRICE_PER_NIGHT_EUR,
  TOURISMUSABGABE_PER_PERSON_PER_NIGHT_EUR,
  TOURISMUSABGABE_UNIT,
} from '@/lib/site';
import {
  BOOKINGS_UPDATED_AT,
  canArriveOn,
  canDepartOn,
  isNightBooked,
  rangeIsFree,
} from '@/lib/bookings';
import {
  MONTH_NAMES,
  WEEKDAY_LABELS,
  addDays,
  buildIsoDate,
  daysInMonth,
  firstWeekdayOfMonth,
  formatEuros,
  formatGermanDate,
  formatGermanDateLong,
  nightsBetween,
} from '@/lib/dates';

// Which of the two dates a click lands on. Both the click handler and the cell
// rendering ask this, so a day cannot look available and then refuse the click —
// or the reverse, which would be worse.
const startsNewStay = (
  checkIn: string,
  checkOut: string,
  isoDate: string
): boolean => checkIn === '' || checkOut !== '' || isoDate <= checkIn;

type SelectableArgs = {
  isoDate: string;
  today: string;
  lastSelectable: string;
  checkIn: string;
  checkOut: string;
};

// Beginning a stay needs the night that starts on this day; closing one needs the
// night before it, plus every night in between still being free — that last check
// is what stops a range being drawn straight through somebody else's booking.
const isDaySelectable = ({
  isoDate,
  today,
  lastSelectable,
  checkIn,
  checkOut,
}: SelectableArgs): boolean => {
  if (isoDate < today || isoDate > lastSelectable) {
    return false;
  }

  return startsNewStay(checkIn, checkOut, isoDate)
    ? canArriveOn(isoDate)
    : canDepartOn(isoDate) && rangeIsFree(checkIn, isoDate);
};

// Whether the selection still describes a stay that can be had. This is a
// different question from isDaySelectable, which answers "could a *new* stay
// start on this day" — a departure landing on the first night of the next
// booking is a perfectly good departure and a bad arrival, so asking the wrong
// one greys out the day the guest just legitimately chose.
//
// Asked once per grid rather than per cell: a range drawn across a booking is
// wrong as a whole, not on one particular day.
const selectionIsSound = (checkIn: string, checkOut: string): boolean => {
  if (checkIn === '') {
    return true;
  }

  if (!canArriveOn(checkIn)) {
    return false;
  }

  if (checkOut === '') {
    return true;
  }

  return canDepartOn(checkOut) && rangeIsFree(checkIn, checkOut);
};

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
  const soundSelection = selectionIsSound(checkIn, checkOut);

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

          const isSelectable = isDaySelectable({
            isoDate,
            today,
            lastSelectable,
            checkIn,
            checkOut,
          });
          const isCheckIn = isoDate === checkIn;
          const isCheckOut = isoDate === checkOut;
          const isBetween =
            checkIn !== '' &&
            checkOut !== '' &&
            isoDate > checkIn &&
            isoDate < checkOut;
          const isSelected = isCheckIn || isCheckOut || isBetween;
          // A selection that no longer holds — because the availability data has
          // moved on under an open page. The provider will not let one be made,
          // so this is the stale case only, and it has to look like a problem
          // rather than quietly like an ordinary selection.
          const isConflict = isSelected && !soundSelection;

          const nightTaken = isNightBooked(isoDate);
          const previousNightTaken = isNightBooked(addDays(isoDate, -1));

          // Past days are already dimmed, and hatching them too would just be
          // noise. The hatching is also dropped under a selection, where it would
          // read as an artefact on top of the solid fill rather than as
          // information — but only under one that still holds. Dropping it under
          // a stale selection blanked the very days that said they were taken,
          // leaving them looking freer than their unselected neighbours.
          const showOccupancy =
            !(isSelected && !isConflict) &&
            isoDate >= today &&
            (nightTaken || previousNightTaken);

          const occupancyClasses = !showOccupancy
            ? ''
            : nightTaken && previousNightTaken
              ? 'day-occupied'
              : previousNightTaken
                ? 'day-occupied day-occupied-morning'
                : 'day-occupied day-occupied-evening';

          const edgeClasses = 'bg-accent text-cream font-semibold';
          const betweenClasses = 'bg-warm-200 text-accent';
          const openClasses =
            'bg-white text-accent hover:bg-warm-100 hover:text-accent';
          const blockedClasses = 'text-warm-300 cursor-not-allowed';
          const conflictClasses =
            'text-red-800 font-semibold cursor-not-allowed';

          // Selected days are styled on whether the selection holds, not on
          // whether a new stay could start on them: a departure on the first
          // night of the next booking is a valid departure and an invalid
          // arrival, and reading isSelectable here greyed it out the moment it
          // was picked.
          const stateClasses = isConflict
            ? conflictClasses
            : isCheckIn || isCheckOut
              ? edgeClasses
              : isBetween
                ? betweenClasses
                : !isSelectable
                  ? blockedClasses
                  : openClasses;

          const occupancyLabel =
            nightTaken && previousNightTaken
              ? ' – belegt'
              : previousNightTaken
                ? ' – nur als Anreisetag frei'
                : nightTaken
                  ? ' – nur als Abreisetag frei'
                  : '';

          const roleLabel = isCheckIn
            ? ' – als Anreise gewählt'
            : isCheckOut
              ? ' – als Abreise gewählt'
              : occupancyLabel;

          return (
            <button
              key={isoDate}
              type="button"
              disabled={!isSelectable}
              onClick={() => onSelect(isoDate)}
              aria-pressed={isSelected}
              aria-label={`${formatGermanDateLong(isoDate)}${roleLabel}${
                isConflict ? ' – inzwischen belegt' : ''
              }`}
              className={`aspect-square flex items-center justify-center font-body text-sm transition-colors duration-150 ${stateClasses} ${occupancyClasses}`}
            >
              {/* Lifted over the hatching, which is painted by a pseudo-element
                  filling the whole cell. */}
              <span className="relative">{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const PricingCalendar = (): React.JSX.Element => {
  // `today` and the bookable horizon come from the provider rather than being
  // resolved here, so the grid and the enquiry form's date fields cannot end up
  // clamped to two different ranges.
  const {
    checkIn,
    checkOut,
    guests,
    today,
    lastBookable,
    setCheckIn,
    setCheckOut,
    setGuests,
    clearDates,
  } = useBookingDates();

  const [monthOffset, setMonthOffset] = useState<number>(0);

  const { months, canGoBack, canGoForward } = useMemo(() => {
    if (today === '') {
      return {
        months: [],
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

    return {
      months: visible,
      canGoBack: monthOffset > 0,
      canGoForward: monthOffset < BOOKABLE_MONTHS_AHEAD - 1,
    };
  }, [today, monthOffset]);

  const handleSelect = (isoDate: string): void => {
    // First click, a click once a range is already complete, or a click at or
    // before the current arrival all begin a new stay. Anything else closes the
    // open one.
    if (startsNewStay(checkIn, checkOut, isoDate)) {
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

  // Kept as three numbers rather than one, because the summary shows the guest
  // the same working it used: base nights, surcharge, sum. A lone total that
  // moves when the head count changes reads like an error.
  const extraGuests = Math.max(0, guests - GUESTS_INCLUDED_IN_BASE_PRICE);
  const baseTotal = nights * PRICE_PER_NIGHT_EUR;
  const extraGuestTotal = nights * extraGuests * EXTRA_GUEST_PER_NIGHT_EUR;
  const total = baseTotal + extraGuestTotal;

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
            Ab {formatEuros(PRICE_PER_NIGHT_EUR)} pro Nacht
          </h2>
          <p className="font-body text-base text-accent-muted max-w-lg leading-relaxed">
            Der gleiche Preis das ganze Jahr über:{' '}
            {formatEuros(PRICE_PER_NIGHT_EUR)} pro Nacht für zwei Personen, jede
            weitere Person {formatEuros(EXTRA_GUEST_PER_NIGHT_EUR)} pro Nacht.
            Bettwäsche und Handtücher sind inklusive. Sucht euch unten euren
            Zeitraum aus. Die Daten werden direkt in die Anfrage übernommen.
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
                      lastSelectable={lastBookable}
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
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 inline-block border border-warm-200 day-occupied"
                  aria-hidden="true"
                />
                Belegt
              </span>
            </div>
          </div>

          {/* Summary. The id is an anchor target for the enquiry form; the
              scroll margin matches the sticky offset so the panel clears the
              fixed navbar on the way in. */}
          <aside
            id="pricing-summary"
            className="bg-white border border-beige p-6 flex flex-col gap-5 scroll-mt-28 lg:sticky lg:top-28"
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
              {/* The label sits in the <dt> and points at the control in the
                  <dd>, so the row keeps reading as one term and its value while
                  the select still gets a proper accessible name. */}
              <div className="flex items-center justify-between gap-4">
                <dt className="font-body text-sm text-accent-muted">
                  <label htmlFor="pricing-guests">Personen</label>
                </dt>
                <dd>
                  <select
                    id="pricing-guests"
                    value={guests}
                    onChange={(event) => setGuests(Number(event.target.value))}
                    className="input-field w-auto py-1.5 pl-3 pr-2 text-sm"
                  >
                    {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map(
                      (n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Person' : 'Personen'}
                        </option>
                      )
                    )}
                  </select>
                </dd>
              </div>
            </dl>

            <div
              className="pt-4 border-t border-beige flex flex-col gap-3"
              aria-live="polite"
            >
              {nights > 0 ? (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-body text-sm text-accent-muted">
                        {nights} {nights === 1 ? 'Nacht' : 'Nächte'} ×{' '}
                        {formatEuros(PRICE_PER_NIGHT_EUR)}
                      </span>
                      <span className="font-body text-sm text-accent">
                        {formatEuros(baseTotal)}
                      </span>
                    </div>
                    {extraGuests > 0 && (
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="font-body text-sm text-accent-muted">
                          {extraGuests}{' '}
                          {extraGuests === 1
                            ? 'weitere Person'
                            : 'weitere Personen'}{' '}
                          × {formatEuros(EXTRA_GUEST_PER_NIGHT_EUR)} ×{' '}
                          {nights} {nights === 1 ? 'Nacht' : 'Nächte'}
                        </span>
                        <span className="font-body text-sm text-accent">
                          {formatEuros(extraGuestTotal)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between gap-4 pt-3 border-t border-beige">
                    <span className="font-body text-sm font-semibold text-accent">
                      Gesamt
                    </span>
                    <span className="font-heading text-2xl font-semibold text-accent">
                      {formatEuros(total)}
                    </span>
                  </div>
                  <p className="font-body text-xs text-warm-500 leading-relaxed">
                    Inkl. Endreinigung, zzgl. Tourismusabgabe von{' '}
                    {formatEuros(TOURISMUSABGABE_PER_PERSON_PER_NIGHT_EUR)}{' '}
                    {TOURISMUSABGABE_UNIT}. Kostenlose Stornierung bis{' '}
                    {FREE_CANCELLATION_DAYS}{' '}
                    Tage vor Anreise. Die Einzelheiten stehen in den{' '}
                    <Link
                      href="/agb"
                      className="underline underline-offset-2 hover:text-warm-600 transition-colors duration-200"
                    >
                      AGB
                    </Link>
                    .
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
              Schraffierte Tage sind schon belegt, Stand{' '}
              {formatGermanDate(BOOKINGS_UPDATED_AT)}. Halb schraffiert heißt
              Wechseltag: vormittags reist jemand ab, nachmittags könnt ihr
              anreisen. Verbindlich wird euer Zeitraum mit unserer Antwort auf
              eure Anfrage.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PricingCalendar;
