// Single source of truth for "today" and Russian date formatting. Everything
// that needs to know the current date (the homepage's 7-day strip, its
// default search date, the calendar dropdown) goes through this module —
// there should be no other hardcoded "today" anywhere in the app.
const MONTH_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];
const MONTH_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
const MONTH_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const WEEKDAY_SHORT_SUN_FIRST = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']; // index = Date#getDay()

// Today at midnight (local time), so date-only comparisons (`<`, `===`)
// work without time-of-day noise.
export function todayDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// e.g. "5 сентября 2026"
export function formatRussianDate(date) {
  return `${date.getDate()} ${MONTH_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
}

// e.g. "5 сентября" — no year, for copy that reads oddly with one
// ("Все места на 5 сентября распроданы").
export function formatRussianDateShort(date) {
  return `${date.getDate()} ${MONTH_GENITIVE[date.getMonth()]}`;
}

export function monthShort(monthIndex0) {
  return MONTH_SHORT[monthIndex0];
}

export function monthNominative(monthIndex0) {
  return MONTH_NOMINATIVE[monthIndex0];
}

export function weekdayShort(date) {
  return WEEKDAY_SHORT_SUN_FIRST[date.getDay()];
}
