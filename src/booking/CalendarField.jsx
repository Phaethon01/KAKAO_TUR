import React from 'react';
import { useIsMobile } from './useIsMobile.js';
import { getTripsForDate } from './tripsCache.js';
import { todayDate, toISO, monthNominative, formatRussianDate } from './today.js';

// Smart price calendar for the "Дата отправления" field.
// Prices load progressively (never blocks): loaded → price, sold out → «нет мест»,
// not yet loaded → shimmer. Cheapest visible price highlighted green;
// selected date outlined brand pink; past dates greyed and inert.

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Current month + next month, computed from the real date — never hardcoded.
function buildMonths(today) {
  const months = [];
  for (let i = 0; i < 2; i++) {
    const first = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const year = first.getFullYear();
    const monthIndex0 = first.getMonth();
    const daysInMonth = new Date(year, monthIndex0 + 1, 0).getDate();
    const offset = (first.getDay() + 6) % 7; // Monday-first column offset
    months.push({ year, monthIndex0, daysInMonth, offset, name: `${monthNominative(monthIndex0)} ${year}` });
  }
  return months;
}

function isoFor(month, day) {
  return toISO(new Date(month.year, month.monthIndex0, day));
}

// Fetches real per-day prices for whichever month(s) are actually visible —
// both, on desktop (shown side by side, always); just the one currently
// paged to, on mobile, so paging to the second month is what triggers
// fetching it rather than loading both ~30-day months upfront. Either way,
// concurrency is capped: a 2-month grid is up to ~60 dates, and firing all
// of them at an external API simultaneously isn't reasonable.
const FETCH_CONCURRENCY = 6;

function useDayPrices(visibleMonths) {
  const [loaded, setLoaded] = React.useState({}); // iso -> { price: number | null }

  React.useEffect(() => {
    let cancelled = false;
    const today = todayDate();
    const isos = [];
    visibleMonths.forEach(m => {
      for (let d = 1; d <= m.daysInMonth; d++) {
        if (new Date(m.year, m.monthIndex0, d) < today) continue; // past — never fetched
        isos.push(isoFor(m, d));
      }
    });

    let cursor = 0;
    async function worker() {
      while (cursor < isos.length) {
        const iso = isos[cursor++];
        try {
          const trips = await getTripsForDate(iso);
          if (cancelled) return;
          const withSeats = trips.filter(t => t.seatsLeft > 0);
          const price = withSeats.length ? Math.min(...withSeats.map(t => t.price)) : null;
          setLoaded(prev => prev[iso] ? prev : { ...prev, [iso]: { price } });
        } catch (err) {
          if (cancelled) return;
          console.error(`[CalendarField] failed to load price for ${iso}`, err);
          setLoaded(prev => prev[iso] ? prev : { ...prev, [iso]: { price: null } });
        }
      }
    }
    Array.from({ length: Math.min(FETCH_CONCURRENCY, isos.length) }, worker);

    return () => { cancelled = true; };
  }, [visibleMonths]);

  return loaded;
}

function navBtn(disabled) {
  return {
    width: 30, height: 30, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)',
    background: 'var(--surface-card)', cursor: disabled ? 'default' : 'pointer',
    color: disabled ? 'var(--neutral-300)' : 'var(--text-primary)', fontSize: 16, fontFamily: 'var(--font-sans)',
  };
}

function PriceCalendar({ selectedIso, onSelect, onClose }) {
  const isMobile = useIsMobile();
  const [mobileMonth, setMobileMonth] = React.useState(0);
  const months = React.useMemo(() => buildMonths(todayDate()), []);
  const visibleMonths = React.useMemo(
    () => isMobile ? [months[mobileMonth]] : months,
    [isMobile, mobileMonth, months],
  );
  const loaded = useDayPrices(visibleMonths);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [onClose]);

  const visiblePrices = [];
  visibleMonths.forEach(m => {
    for (let d = 1; d <= m.daysInMonth; d++) {
      const entry = loaded[isoFor(m, d)];
      if (entry && entry.price != null) visiblePrices.push(entry.price);
    }
  });
  const cheapest = visiblePrices.length ? Math.min(...visiblePrices) : null;

  return (
    <div ref={ref} style={{
      position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 40,
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
      padding: 20, width: isMobile ? 'min(92vw, 360px)' : 640,
    }}>
      {isMobile ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <button onClick={() => setMobileMonth(0)} disabled={mobileMonth === 0} style={navBtn(mobileMonth === 0)}>‹</button>
          <span style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-sm)' }}>{months[mobileMonth].name}</span>
          <button onClick={() => setMobileMonth(1)} disabled={mobileMonth === 1} style={navBtn(mobileMonth === 1)}>›</button>
        </div>
      ) : null}
      <div style={{ display: 'flex', gap: 28 }}>
        {visibleMonths.map(m => (
          <Month key={`${m.year}-${m.monthIndex0}`} month={m} loaded={loaded} cheapest={cheapest} selectedIso={selectedIso} onSelect={onSelect} showName={!isMobile} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--status-success-bg)', border: '1px solid var(--status-success)' }}></span>самая низкая цена</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 3, border: '1.5px solid var(--brand-primary)' }}></span>выбранная дата</span>
      </div>
    </div>
  );
}

function Month({ month, loaded, cheapest, selectedIso, onSelect, showName }) {
  const cells = [];
  for (let i = 0; i < month.offset; i++) cells.push(null);
  for (let d = 1; d <= month.daysInMonth; d++) cells.push(d);

  return (
    <div style={{ flex: 1 }}>
      {showName ? <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-sm)', marginBottom: 10, textAlign: 'center' }}>{month.name}</div> : <div style={{ height: 6 }}></div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {WEEKDAYS.map(w => (
          <div key={w} style={{ textAlign: 'center', fontSize: 10, fontWeight: 'var(--fw-semibold)', color: 'var(--text-tertiary)', padding: '2px 0' }}>{w}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((d, i) => d === null
          ? <div key={`e${i}`}></div>
          : <DayCell key={d} month={month} day={d} loaded={loaded} cheapest={cheapest} selectedIso={selectedIso} onSelect={onSelect} />)}
      </div>
    </div>
  );
}

function DayCell({ month, day, loaded, cheapest, selectedIso, onSelect }) {
  const iso = isoFor(month, day);
  const isPast = new Date(month.year, month.monthIndex0, day) < todayDate();
  const entry = loaded[iso];
  const price = entry ? entry.price : undefined;
  const soldOut = entry && price == null;
  const isSelected = selectedIso === iso;
  const isCheapest = entry && price != null && price === cheapest;
  const [hover, setHover] = React.useState(false);

  if (isPast) {
    return (
      <div style={{ padding: '5px 2px 6px', textAlign: 'center', borderRadius: 'var(--radius-sm)', color: 'var(--neutral-300)' }}>
        <div style={{ fontSize: 'var(--text-sm)' }}>{day}</div>
        <div style={{ height: 13 }}></div>
      </div>
    );
  }

  return (
    <button
      onClick={() => !soldOut && entry && onSelect({ iso, day, price })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={soldOut ? 'нет мест' : undefined}
      style={{
        padding: '5px 2px 6px', textAlign: 'center', fontFamily: 'var(--font-sans)',
        border: isSelected ? '1.5px solid var(--brand-primary)' : '1.5px solid transparent',
        borderRadius: 'var(--radius-sm)',
        background: isCheapest ? 'var(--status-success-bg)' : hover && !soldOut ? 'var(--surface-sunken)' : 'transparent',
        cursor: soldOut ? 'default' : 'pointer', opacity: soldOut ? 0.45 : 1,
      }}
    >
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: isSelected ? 'var(--fw-bold)' : 'var(--fw-medium)', color: 'var(--text-primary)' }}>{day}</div>
      {!entry ? (
        <div style={{
          height: 9, width: 26, margin: '2px auto 0', borderRadius: 3,
          background: 'linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-200) 50%, var(--neutral-100) 75%)',
          backgroundSize: '80px 100%', animation: 'kt-shimmer 1.1s linear infinite',
        }}></div>
      ) : soldOut ? (
        <div style={{ fontSize: 8.5, color: 'var(--text-tertiary)', marginTop: 2, lineHeight: 1 }}>{hover ? 'нет мест' : '—'}</div>
      ) : (
        <div style={{ fontSize: 10, fontWeight: 'var(--fw-semibold)', marginTop: 1, color: isCheapest ? 'var(--status-success)' : 'var(--text-tertiary)' }}>{price}</div>
      )}
    </button>
  );
}

export function CalendarField({ value, onPick }) {
  const [open, setOpen] = React.useState(false);
  const [selectedIso, setSelectedIso] = React.useState(null);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', height: 46, padding: '0 14px', borderRadius: 'var(--radius-md)',
        border: `1.5px solid ${open ? 'var(--border-focus)' : 'var(--border-default)'}`,
        boxShadow: open ? 'var(--focus-ring)' : 'none',
        background: 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 'var(--text-body)', color: 'var(--text-primary)', fontWeight: 'var(--fw-medium)',
        fontFamily: 'var(--font-sans)', cursor: 'pointer', textAlign: 'left',
      }}>
        {value}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>
      {open ? (
        <PriceCalendar
          selectedIso={selectedIso}
          onClose={() => setOpen(false)}
          onSelect={({ iso }) => {
            setSelectedIso(iso);
            setOpen(false);
            const [y, m, d] = iso.split('-').map(Number);
            const label = formatRussianDate(new Date(y, m - 1, d));
            onPick(label, iso);
          }}
        />
      ) : null}
    </div>
  );
}
