'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

// The price calendar and the enquiry form sit in different sections of the page
// but edit the same two dates. Holding them here means picking a range in the
// calendar fills in Anreise and Abreise, and typing into those fields moves the
// calendar selection — rather than the two drifting apart.

type BookingDatesContextValue = {
  checkIn: string;
  checkOut: string;
  setCheckIn: (isoDate: string) => void;
  setCheckOut: (isoDate: string) => void;
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

  const clearDates = useCallback((): void => {
    setCheckInState('');
    setCheckOutState('');
  }, []);

  const value = useMemo(
    () => ({ checkIn, checkOut, setCheckIn, setCheckOut, clearDates }),
    [checkIn, checkOut, setCheckIn, setCheckOut, clearDates]
  );

  return (
    <BookingDatesContext.Provider value={value}>
      {children}
    </BookingDatesContext.Provider>
  );
};

export default BookingDatesProvider;
