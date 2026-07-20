import React from 'react';
import { TRIPS } from './data/trips.js';

const BookingContext = React.createContext(null);

const EMPTY_PASSENGER = { first: '', last: '', middle: '', phone: '', email: '' };

export function BookingProvider({ children }) {
  const [form, setForm] = React.useState({ date: '17 июля 2026' });
  const [filter, setFilter] = React.useState(null);
  const [trip, setTrip] = React.useState(null);
  const [selectedSeats, setSelectedSeats] = React.useState([]);
  const [passenger, setPassenger] = React.useState(EMPTY_PASSENGER);
  const [method, setMethod] = React.useState('card');

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
    trips: TRIPS, filter, setFilter,
    trip, setTrip,
    selectedSeats, toggleSeat,
    passenger, updatePassenger,
    method, setMethod,
    reset,
  }), [form, filter, trip, selectedSeats, passenger, method, toggleSeat, updatePassenger, reset]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = React.useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within a BookingProvider');
  return ctx;
}
