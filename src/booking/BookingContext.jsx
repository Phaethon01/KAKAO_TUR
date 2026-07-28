import React from 'react';
import { getTripsForDate } from './tripsCache.js';

const BookingContext = React.createContext(null);

const EMPTY_PASSENGER = { first: '', last: '', middle: '', phone: '', email: '' };
const DEFAULT_FORM = { date: '17 июля 2026', dateISO: '2026-07-17' };

export function BookingProvider({ children }) {
  const [form, setForm] = React.useState(DEFAULT_FORM);
  const [filter, setFilter] = React.useState(null);
  const [trip, setTrip] = React.useState(null);
  const [selectedSeats, setSelectedSeats] = React.useState([]);
  const [passenger, setPassenger] = React.useState(EMPTY_PASSENGER);
  const [method, setMethod] = React.useState('card');

  const [trips, setTrips] = React.useState([]);
  const [tripsStatus, setTripsStatus] = React.useState('idle'); // idle | loading | success | error
  const [tripsError, setTripsError] = React.useState(null);
  const searchId = React.useRef(0);

  const runSearch = React.useCallback(async (dateISO) => {
    const id = ++searchId.current;
    setTripsStatus('loading');
    setTripsError(null);
    try {
      const results = await getTripsForDate(dateISO);
      if (id !== searchId.current) return; // a newer search superseded this one
      setTrips(results);
      setTripsStatus('success');
    } catch (err) {
      if (id !== searchId.current) return;

      // TEMP DEV FALLBACK — only in dev builds, so a real outage in
      // production still shows the real error state instead of quietly
      // letting people "book" seats on fake trips. Remove this block once
      // the CORS issue is fixed server-side (see searchTrips.js TODO).
      // Dynamic import so the mock data never ships in the production
      // bundle at all, not just never runs.
      if (import.meta.env.DEV) {
        console.warn(
          '%c[searchTrips] FALLBACK DATA IN USE — the real API call failed, so the results screen is showing static mock trips from src/booking/data/trips.js instead. This is NOT live data.',
          'color:#a15c00; font-weight:bold;',
        );
        console.warn('[searchTrips] original error that triggered the fallback:', err);
        const { TRIPS } = await import('./data/trips.js');
        if (id !== searchId.current) return;
        setTrips(TRIPS);
        setTripsStatus('success');
        return;
      }

      setTripsError(err);
      setTripsStatus('error');
    }
  }, []);

  const toggleSeat = React.useCallback((id) => {
    setSelectedSeats(seats => seats.includes(id) ? seats.filter(x => x !== id) : [...seats, id]);
  }, []);

  const updatePassenger = React.useCallback((key, value) => {
    setPassenger(p => ({ ...p, [key]: value }));
  }, []);

  const reset = React.useCallback(() => {
    setTrip(null);
    setSelectedSeats([]);
    setPassenger(EMPTY_PASSENGER);
    setMethod('card');
  }, []);

  const value = React.useMemo(() => ({
    form, setForm,
    trips, tripsStatus, tripsError, runSearch,
    filter, setFilter,
    trip, setTrip,
    selectedSeats, toggleSeat,
    passenger, updatePassenger,
    method, setMethod,
    reset,
  }), [form, trips, tripsStatus, tripsError, runSearch, filter, trip, selectedSeats, passenger, method, toggleSeat, updatePassenger, reset]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = React.useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider');
  return ctx;
}
