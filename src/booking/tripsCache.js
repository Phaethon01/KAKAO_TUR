import { searchTrips } from './searchTrips.js';

// Shared, module-level cache keyed by ISO date. Two independent call sites
// (the homepage's 7-day price strip and the results screen) both need
// per-date trip data, and picking a date already priced in the strip
// shouldn't fire a second identical request — this is the one place that
// dedupes/caches those calls for both.
//
// Caches the in-flight Promise itself (not just the resolved value) so
// concurrent callers for the same date share one request instead of firing
// two. Failures are NOT cached, so a retry (the results screen's "Повторить"
// button, or the strip trying again) can actually hit the network again.
const cache = new Map(); // dateISO -> Promise<trip[]>

export function getTripsForDate(dateISO) {
  if (!cache.has(dateISO)) {
    const promise = searchTrips(dateISO).catch(err => {
      cache.delete(dateISO);
      throw err;
    });
    cache.set(dateISO, promise);
  }
  return cache.get(dateISO);
}
