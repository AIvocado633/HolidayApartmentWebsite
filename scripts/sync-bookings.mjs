/**
 * Regenerates `data/bookings.json` from the Google Calendar that holds the
 * apartment's occupancy, so accepting a reservation costs one calendar entry and
 * nothing else.
 *
 * Usage:
 *   GOOGLE_ICAL_URL="https://calendar.google.com/calendar/ical/.../basic.ics" \
 *     npm run sync:bookings
 *
 * Normally this runs unattended from .github/workflows/sync-bookings.yml. Run it
 * by hand to see what the calendar currently produces.
 *
 * The convention the calendar is kept in: one all-day event per stay, running
 * from the arrival day to the departure day — the way you would say it out loud.
 * iCalendar ends an all-day event on the day *after* the last one it covers
 * (RFC 5545 calls DTEND non-inclusive), so a stay entered as 1.–8. September
 * arrives here as DTEND 20260909 and the departure day is that minus one day.
 * Getting this backwards would free up a night that is actually taken, which is
 * the one failure here that can produce a double booking — hence the round-trip
 * check in the workflow.
 *
 * Only dates are written out. The repository is public, so guest names and
 * anything else in the event deliberately never leave the calendar.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = path.join(ROOT, 'data', 'bookings.json');

const DAY_MS = 86_400_000;

const toUtcMs = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);

  return Date.UTC(year, month - 1, day);
};

const fromUtcMs = (ms) => new Date(ms).toISOString().slice(0, 10);

const addDays = (isoDate, days) => fromUtcMs(toUtcMs(isoDate) + days * DAY_MS);

/** "20260901", as the feed writes dates, into the "2026-09-01" the site stores. */
const toIsoDate = (compact) =>
  `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;

const IS_CALENDAR_DATE = /^\d{8}$/;

/**
 * RFC 5545 wraps long lines and marks the continuation with a leading space or
 * tab. None of the properties read below are long enough to wrap, but unfolding
 * first stops a wrapped SUMMARY from shifting the lines that matter.
 */
const unfold = (ics) => ics.replace(/\r?\n[ \t]/g, '');

const splitEvents = (ics) =>
  unfold(ics)
    .split('BEGIN:VEVENT')
    .slice(1)
    .map((block) => block.split('END:VEVENT')[0]);

/** The raw value of a property, ignoring any parameters between name and colon. */
const readProperty = (block, name) => {
  const match = block.match(new RegExp(`^${name}[^:\\r\\n]*:(.*)$`, 'm'));

  return match === null ? null : match[1].trim();
};

const parseStays = (ics) => {
  const stays = [];

  for (const block of splitEvents(ics)) {
    if (/^STATUS:CANCELLED/m.test(block)) {
      continue;
    }

    const start = readProperty(block, 'DTSTART');

    if (start === null) {
      console.warn('Skipping an event without a start date.');
      continue;
    }

    // A booking is a plain all-day event. Anything else in this calendar is a
    // note rather than a stay, and guessing at what it blocks would be worse
    // than saying so and moving on.
    if (!IS_CALENDAR_DATE.test(start)) {
      console.warn(
        `Skipping the event starting ${start}: bookings are entered as all-day events.`
      );
      continue;
    }

    if (/^RRULE:/m.test(block)) {
      console.warn(
        `Skipping the repeating event on ${toIsoDate(start)}: a stay does not repeat.`
      );
      continue;
    }

    const arrival = toIsoDate(start);
    const end = readProperty(block, 'DTEND');

    // An all-day event with no DTEND covers a single day (RFC 5545 §3.6.1).
    const endExclusive =
      end !== null && IS_CALENDAR_DATE.test(end)
        ? toIsoDate(end)
        : addDays(arrival, 1);

    let departure = addDays(endExclusive, -1);

    if (departure <= arrival) {
      // A one-day event describes no nights at all under the arrival-to-departure
      // reading, so it is either a mistake or shorthand. Read it as blocking that
      // night: an unwanted block costs an enquiry, a missing one costs a double
      // booking.
      console.warn(
        `Single-day event on ${arrival}: blocking that night. Enter a stay as arrival day to departure day.`
      );
      departure = addDays(arrival, 1);
    }

    stays.push({ from: arrival, to: departure });
  }

  return stays;
};

/**
 * Sorted, with overlapping and back-to-back stays folded together. Two stays that
 * share a changeover day merge on `<=`, which loses no night: the shared day is
 * taken on both sides anyway.
 */
const merge = (stays) => {
  const sorted = [...stays].sort((a, b) => a.from.localeCompare(b.from));
  const merged = [];

  for (const stay of sorted) {
    const last = merged[merged.length - 1];

    if (last !== undefined && stay.from <= last.to) {
      if (stay.to > last.to) {
        last.to = stay.to;
      }

      continue;
    }

    merged.push({ ...stay });
  }

  return merged;
};

const readExistingBookings = async () => {
  try {
    const existing = JSON.parse(await readFile(OUTPUT, 'utf8'));

    return existing.bookings ?? [];
  } catch {
    return null;
  }
};

const main = async () => {
  const url = process.env.GOOGLE_ICAL_URL;

  if (!url) {
    console.error(
      'GOOGLE_ICAL_URL is not set. It is the "Secret address in iCal format" of the apartment calendar, kept as a repository secret.'
    );
    process.exit(1);
  }

  const response = await fetch(url);

  if (!response.ok) {
    console.error(`The calendar feed answered ${response.status}.`);
    process.exit(1);
  }

  const ics = await response.text();

  // The dangerous failure is a feed that fetches fine but is not a calendar — an
  // expired URL answers with an HTML page, which would parse to zero stays and
  // quietly declare the whole year free. Refuse rather than publish that.
  if (!ics.includes('BEGIN:VCALENDAR')) {
    console.error(
      'That URL did not return a calendar. Check the secret iCal address; a revoked one answers with a web page.'
    );
    process.exit(1);
  }

  const today = fromUtcMs(Date.now());
  const bookings = merge(parseStays(ics)).filter(({ to }) => to > today);

  const existing = await readExistingBookings();

  if (existing !== null && JSON.stringify(existing) === JSON.stringify(bookings)) {
    console.log(`Availability unchanged: ${bookings.length} upcoming stay(s).`);
    return;
  }

  // `updatedAt` tracks the last actual change, not the last check. Stamping every
  // run would rewrite the file daily and trigger a deploy that changes nothing.
  const payload = { updatedAt: today, bookings };

  await mkdir(path.dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${bookings.length} upcoming stay(s) to data/bookings.json.`);
};

await main();
