'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  canArriveOn,
  canDepartOn,
  lastBookableDay,
  rangeIsFree,
} from '@/lib/bookings';
import { toIsoDate } from '@/lib/dates';
import {
  BOOKABLE_MONTHS_AHEAD,
  GUESTS_INCLUDED_IN_BASE_PRICE,
  MAX_GUESTS,
} from '@/lib/site';

// The price calendar and the enquiry form sit in different sections of the page
// but describe the same stay. Holding it here means picking a range in the
// calendar fills in Anreise and Abreise, and typing into those fields moves the
// calendar selection — rather than the two drifting apart.
//
// The party size joined the dates once it started moving the price: the
// calendar cannot total a stay it does not know the head count for, and a guest
// who sets it in one place and finds the other still on two would rightly not
// believe either number.
//
// Availability is enforced here rather than in either component, because the two
// surfaces cannot refuse a date equally well on their own. The calendar can
// disable a cell; the form's Anreise and Abreise are native date inputs, which
// only understand min and max and have no way to grey out the booked days in
// between. Leaving each to police itself is what let a booked range typed into
// the form reach the calendar, where it painted over the very hatching that said
// those nights were taken — and let the summary total a stay nobody can have.
// A date that fails a rule below never enters the state, so no surface has to.

export type DateField = 'checkIn' | 'checkOut';

export type DateIssue = {
  field: DateField;
  message: string;
};

const TOO_FAR_AHEAD = `Wir vergeben Termine höchstens ${BOOKABLE_MONTHS_AHEAD} Monate im Voraus.`;

// The rules a date has to pass, in the order a guest runs into them. These
// return the sentence rather than a boolean so the reason travels with the rule
// instead of the caller having to work out which one failed.
//
// `today` and `lastBookable` are empty until the mount effect below resolves
// them; the checks that need them stand down until they arrive rather than
// comparing against an empty string, which sorts before every real date.
const arrivalRefusal = (
  isoDate: string,
  today: string,
  lastBookable: string
): string | null => {
  if (today !== '' && isoDate < today) {
    return 'Dieser Tag liegt schon in der Vergangenheit.';
  }

  if (lastBookable !== '' && isoDate > lastBookable) {
    return TOO_FAR_AHEAD;
  }

  if (!canArriveOn(isoDate)) {
    return 'An diesem Tag ist die Wohnung schon belegt.';
  }

  return null;
};

const departureRefusal = (
  isoDate: string,
  checkIn: string,
  lastBookable: string
): string | null => {
  if (lastBookable !== '' && isoDate > lastBookable) {
    return TOO_FAR_AHEAD;
  }

  // Without an arrival there is no range to check, only the day itself: leaving
  // on a morning after a night somebody else has booked is not on offer.
  if (checkIn === '') {
    return canDepartOn(isoDate)
      ? null
      : 'An diesem Tag ist die Wohnung noch belegt.';
  }

  if (isoDate <= checkIn) {
    return 'Die Abreise muss nach der Anreise liegen.';
  }

  // Covers the departure day too: the night before it is the last one the stay
  // occupies, so a range that clears this cannot end inside a booking either.
  if (!rangeIsFree(checkIn, isoDate)) {
    return 'In diesem Zeitraum ist die Wohnung schon belegt.';
  }

  return null;
};

type BookingDatesContextValue = {
  checkIn: string;
  checkOut: string;
  guests: number;
  /** The guest's local day, empty until the mount effect resolves it. */
  today: string;
  /** The last day a stay may touch, empty for as long as `today` is. */
  lastBookable: string;
  /** Why the last date was turned down, if it was. */
  dateIssue: DateIssue | null;
  setCheckIn: (isoDate: string) => void;
  setCheckOut: (isoDate: string) => void;
  setGuests: (guests: number) => void;
  clearDates: () => void;
  clearDateIssue: () => void;
};

const BookingDatesContext = createContext<BookingDatesContextValue | null>(null);

export const useBookingDates = (): BookingDatesContextValue => {
  const value = useContext(BookingDatesContext);

  if (value === null) {
    throw new Error(
      'useBookingDates has to be called inside a BookingDatesProvider'
    );
  }

  return value;
};

type BookingDatesProviderProps = {
  children: React.ReactNode;
};

const BookingDatesProvider = ({
  children,
}: BookingDatesProviderProps): React.JSX.Element => {
  const [checkIn, setCheckInState] = useState<string>('');
  const [checkOut, setCheckOutState] = useState<string>('');
  // Opens on the number the base rate already covers, so the first total a
  // guest is shown carries no surcharge to explain.
  const [guests, setGuestsState] = useState<number>(GUESTS_INCLUDED_IN_BASE_PRICE);
  const [dateIssue, setDateIssue] = useState<DateIssue | null>(null);

  // Resolved after mount, and once for both consumers. The page is prerendered
  // at build time, so a build-time "today" would bake in a stale day and trip a
  // hydration mismatch as soon as the build is a day old.
  const [today, setToday] = useState<string>('');

  useEffect(() => {
    setToday(toIsoDate(new Date()));
  }, []);

  const lastBookable = useMemo(
    () => (today === '' ? '' : lastBookableDay(today)),
    [today]
  );

  const setCheckIn = useCallback(
    (isoDate: string): void => {
      // An emptied date field is not a rejected date. The departure stays put:
      // a guest clearing the arrival to re-pick it should not have to enter the
      // other end again, and a lone departure is a state the rules below handle.
      if (isoDate === '') {
        setCheckInState('');
        setDateIssue(null);
        return;
      }

      const refusal = arrivalRefusal(isoDate, today, lastBookable);

      if (refusal !== null) {
        // The previous arrival stands. Snapping the field back to a date that
        // does work beats clearing it and leaving the guest to find one twice.
        setDateIssue({ field: 'checkIn', message: refusal });
        return;
      }

      setDateIssue(null);
      setCheckInState(isoDate);
      // A departure the new arrival has invalidated goes: one that no longer
      // follows it would leave a negative stay, and one the move has stretched
      // across somebody else's booking would leave an unbookable range.
      setCheckOutState((previous) =>
        previous !== '' &&
        (previous <= isoDate || !rangeIsFree(isoDate, previous))
          ? ''
          : previous
      );
    },
    [today, lastBookable]
  );

  const setCheckOut = useCallback(
    (isoDate: string): void => {
      if (isoDate === '') {
        setCheckOutState('');
        setDateIssue(null);
        return;
      }

      const refusal = departureRefusal(isoDate, checkIn, lastBookable);

      if (refusal !== null) {
        setDateIssue({ field: 'checkOut', message: refusal });
        return;
      }

      setDateIssue(null);
      setCheckOutState(isoDate);
    },
    [checkIn, lastBookable]
  );

  // Clamped rather than trusted: both callers offer a fixed list of options, but
  // a head count that escaped the range would go straight into a price.
  const setGuests = useCallback((next: number): void => {
    setGuestsState(Math.min(Math.max(Math.round(next), 1), MAX_GUESTS));
  }, []);

  // Dates only, as the name says. The party size outlives a cleared selection —
  // a guest picking new dates is still the same number of people — so the one
  // place that does reset it, the enquiry form after a successful send, says so
  // explicitly instead.
  const clearDates = useCallback((): void => {
    setCheckInState('');
    setCheckOutState('');
    setDateIssue(null);
  }, []);

  const clearDateIssue = useCallback((): void => {
    setDateIssue(null);
  }, []);

  const value = useMemo(
    () => ({
      checkIn,
      checkOut,
      guests,
      today,
      lastBookable,
      dateIssue,
      setCheckIn,
      setCheckOut,
      setGuests,
      clearDates,
      clearDateIssue,
    }),
    [
      checkIn,
      checkOut,
      guests,
      today,
      lastBookable,
      dateIssue,
      setCheckIn,
      setCheckOut,
      setGuests,
      clearDates,
      clearDateIssue,
    ]
  );

  return (
    <BookingDatesContext.Provider value={value}>
      {children}
    </BookingDatesContext.Provider>
  );
};

export default BookingDatesProvider;
