'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { GUESTS_INCLUDED_IN_BASE_PRICE, MAX_GUESTS } from '@/lib/site';

// The price calendar and the enquiry form sit in different sections of the page
// but describe the same stay. Holding it here means picking a range in the
// calendar fills in Anreise and Abreise, and typing into those fields moves the
// calendar selection — rather than the two drifting apart.
//
// The party size joined the dates once it started moving the price: the
// calendar cannot total a stay it does not know the head count for, and a guest
// who sets it in one place and finds the other still on two would rightly not
// believe either number.

type BookingDatesContextValue = {
  checkIn: string;
  checkOut: string;
  guests: number;
  setCheckIn: (isoDate: string) => void;
  setCheckOut: (isoDate: string) => void;
  setGuests: (guests: number) => void;
  clearDates: () => void;
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

  // Moving the arrival past the departure would leave a negative stay, so the
  // departure is dropped and the guest picks it again.
  const setCheckIn = useCallback((isoDate: string): void => {
    setCheckInState(isoDate);
    setCheckOutState((previous) =>
      previous !== '' && previous <= isoDate ? '' : previous
    );
  }, []);

  const setCheckOut = useCallback((isoDate: string): void => {
    setCheckOutState(isoDate);
  }, []);

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
  }, []);

  const value = useMemo(
    () => ({
      checkIn,
      checkOut,
      guests,
      setCheckIn,
      setCheckOut,
      setGuests,
      clearDates,
    }),
    [
      checkIn,
      checkOut,
      guests,
      setCheckIn,
      setCheckOut,
      setGuests,
      clearDates,
    ]
  );

  return (
    <BookingDatesContext.Provider value={value}>
      {children}
    </BookingDatesContext.Provider>
  );
};

export default BookingDatesProvider;
