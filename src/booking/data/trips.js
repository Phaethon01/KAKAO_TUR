export const TRIPS = [
  {
    id: 1, depart: '08:00', arrive: '16:30', duration: '8ч 30м', operator: 'Visit Tour',
    arriveStation: 'м. Тёплый Стан', price: 45, seatsLeft: 12,
    trust: { overall: 4.8, punctuality: 4.9, comfort: 4.7, cleanliness: 4.7 },
    amenities: ['wifi', 'plug-zap', 'wind'],
  },
  {
    id: 2, depart: '13:15', arrive: '21:40', duration: '8ч 25м', operator: 'Intercars',
    arriveStation: 'м. Партизанская', price: 42, seatsLeft: 3,
    trust: { overall: 4.5, punctuality: 4.3, comfort: 4.6, cleanliness: 4.5 },
    amenities: ['wifi', 'plug-zap'],
  },
  {
    id: 3, depart: '22:00', arrive: '06:20', duration: '8ч 20м', operator: 'Visit Tour',
    arriveStation: 'м. Тёплый Стан', price: 48, seatsLeft: 0,
    trust: { overall: 4.8, punctuality: 4.9, comfort: 4.7, cleanliness: 4.7 },
    amenities: ['wifi', 'plug-zap', 'wind', 'tv'],
  },
];
