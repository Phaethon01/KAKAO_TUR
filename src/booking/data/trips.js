// Dev-only fallback data (see BookingContext's runSearch) — kept in the
// same shape real trips come back in, including capacity/freeSeats, so the
// seat selection screen doesn't need special-casing for the fallback path.
function freeSeatsFrom(numbers) {
  return Object.fromEntries(numbers.map(n => [String(n), { id: `mock-${n}`, number: String(n) }]));
}

export const TRIPS = [
  {
    id: 1, depart: '08:00', arrive: '16:30', duration: '8ч 30м', operator: 'Visit Tour',
    arriveStation: 'м. Тёплый Стан', price: 45, seatsLeft: 12,
    capacity: 44,
    freeSeats: freeSeatsFrom([2, 5, 9, 14, 16, 20, 23, 27, 31, 34, 38, 42]),
  },
  {
    id: 2, depart: '13:15', arrive: '21:40', duration: '8ч 25м', operator: 'Intercars',
    arriveStation: 'м. Партизанская', price: 42, seatsLeft: 3,
    capacity: 44,
    freeSeats: freeSeatsFrom([10, 25, 40]),
  },
  {
    id: 3, depart: '22:00', arrive: '06:20', duration: '8ч 20м', operator: 'Visit Tour',
    arriveStation: 'м. Тёплый Стан', price: 48, seatsLeft: 0,
    capacity: 44,
    freeSeats: {},
  },
];
