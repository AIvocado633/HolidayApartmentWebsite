// Dates travel as plain ISO day strings ("2026-09-01") rather than Date objects.
// That is the shape the date inputs use and the enquiry posts, they compare and
// sort correctly as strings, and they carry no time or zone to go wrong.

export const MONTH_NAMES: string[] = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

// German calendars start on Monday, so every weekday index in here is
// Monday-based rather than JavaScript's Sunday-based getDay().
export const WEEKDAY_LABELS: string[] = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

/**
 * The local calendar day. toISOString() reports the UTC day and would roll over
 * to tomorrow during the evening in German time zones.
 */
export const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const toIsoDateParts = (isoDate: string): [number, number, number] => {
  const [year, month, day] = isoDate.split('-').map(Number);

  return [year, month, day];
};

// Day arithmetic goes through Date.UTC deliberately: local Date maths spans the
// October and March clock changes, which would turn a seven-night stay into 6.96
// nights and round wrong.
const toUtcMs = (isoDate: string): number => {
  const [year, month, day] = toIsoDateParts(isoDate);

  return Date.UTC(year, month - 1, day);
};

export const nightsBetween = (checkIn: string, checkOut: string): number =>
  Math.round((toUtcMs(checkOut) - toUtcMs(checkIn)) / 86_400_000);

export const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

/** Weekday the 1st falls on, Monday-based, for padding the start of the grid. */
export const firstWeekdayOfMonth = (year: number, month: number): number =>
  (new Date(year, month, 1).getDay() + 6) % 7;

export const buildIsoDate = (
  year: number,
  month: number,
  day: number
): string =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const formatGermanDate = (isoDate: string): string => {
  const [year, month, day] = toIsoDateParts(isoDate);

  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
};

/** Spelled out, for screen-reader labels on the calendar cells. */
export const formatGermanDateLong = (isoDate: string): string => {
  const [year, month, day] = toIsoDateParts(isoDate);

  return `${day}. ${MONTH_NAMES[month - 1]} ${year}`;
};

export const formatEuros = (amount: number): string =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
