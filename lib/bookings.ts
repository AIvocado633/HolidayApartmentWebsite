import bookingsData from '@/data/bookings.json';
import { addDays } from '@/lib/dates';

// Which nights are already taken. `data/bookings.json` is regenerated from the
// apartment's Google Calendar by scripts/sync-bookings.mjs, and stays readable
// enough to edit by hand when that sync lags behind.
//
// A stay is stored as its arrival and departure day, and what it actually
// occupies is the *nights* in between: a guest arriving on the 1st and leaving on
// the 8th sleeps the nights of the 1st to the 7th. Counting nights rather than
// days is what keeps the 8th sellable as the next guest's arrival and the 1st
// sellable as someone else's departure — two days per booking that a naive
// day-range would swallow.

type BookedStay = {
  from: string;
  to: string;
};

const { updatedAt, bookings } = bookingsData as {
  updatedAt: string;
  bookings: BookedStay[];
};

/** The day the availability last changed, not the day it was last checked. */
export const BOOKINGS_UPDATED_AT: string = updatedAt;

// Expanded once at module load: a set lookup beats re-scanning the ranges for
// each of the ~60 cells a calendar view renders. Stays that have already ended
// are dropped by the sync script rather than here, because filtering against
// "today" at module scope would bake the build date into the prerendered HTML —
// the same trap PricingCalendar and ContactForm both resolve after mount.
const BOOKED_NIGHTS: Set<string> = new Set(
  bookings.flatMap(({ from, to }) => {
    const nights: string[] = [];

    for (let night = from; night < to; night = addDays(night, 1)) {
      nights.push(night);
    }

    return nights;
  })
);

/** Whether the night *starting* on this day is taken. */
export const isNightBooked = (isoDate: string): boolean =>
  BOOKED_NIGHTS.has(isoDate);

/** Arriving on a day means sleeping that night. */
export const canArriveOn = (isoDate: string): boolean => !isNightBooked(isoDate);

/** Departing on a day means having slept the night before it. */
export const canDepartOn = (isoDate: string): boolean =>
  !isNightBooked(addDays(isoDate, -1));

/** Whether every night of a stay is free, so it does not straddle a booking. */
export const rangeIsFree = (checkIn: string, checkOut: string): boolean => {
  for (let night = checkIn; night < checkOut; night = addDays(night, 1)) {
    if (isNightBooked(night)) {
      return false;
    }
  }

  return true;
};
