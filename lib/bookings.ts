import bookingsData from '@/data/bookings.json';
import { addDays, toIsoDate, toIsoDateParts } from '@/lib/dates';
import { BOOKABLE_MONTHS_AHEAD } from '@/lib/site';

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

// Sorted once alongside the set: the set answers "is this night taken", which is
// all the calendar grid needs, but the date inputs need the *next* taken night
// to put a ceiling on the departure picker, and a set cannot be scanned in order.
const BOOKED_NIGHTS_IN_ORDER: string[] = [...BOOKED_NIGHTS].sort();

/** The first taken night on or after this day, or '' if none is booked. */
export const nextBookedNightFrom = (isoDate: string): string =>
  BOOKED_NIGHTS_IN_ORDER.find((night) => night >= isoDate) ?? '';

/**
 * How far ahead a stay can be requested: the end of the month
 * BOOKABLE_MONTHS_AHEAD after the one `today` falls in. Day 0 of a month is the
 * last day of the one before it, which is what saves counting month lengths.
 *
 * Both the calendar and the enquiry form derive their upper bound from here, so
 * the form cannot accept a date the calendar will not even display.
 */
export const lastBookableDay = (today: string): string => {
  const [year, month] = toIsoDateParts(today);

  return toIsoDate(new Date(year, month + BOOKABLE_MONTHS_AHEAD, 0));
};

/**
 * The last day a stay beginning on `checkIn` may end on. Departing means having
 * slept the night *before* the departure day, so the next taken night is itself
 * still a legal departure — it is the night after it that belongs to someone
 * else. Whichever comes first, that booking or the bookable horizon, wins.
 */
export const lastDepartureFor = (checkIn: string, horizon: string): string => {
  const taken = nextBookedNightFrom(checkIn);

  return taken === '' || taken > horizon ? horizon : taken;
};
