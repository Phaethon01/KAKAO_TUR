import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Badge } from '../../design-system/index.js';
import { useIsMobile } from '../useIsMobile.js';
import { useBooking } from '../BookingContext.jsx';
import { CalendarField } from '../CalendarField.jsx';
import { getTripsForDate } from '../tripsCache.js';
import { todayDate, toISO, monthShort, weekdayShort, formatRussianDateShort } from '../today.js';

// Forward-looking dates only — the real current date through the next 6
// days. Computed once at module load (i.e. as of page load); a tab left
// open across midnight won't roll the date without a refresh, same as most
// web apps.
function buildDateRange() {
  const start = todayDate();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const iso = toISO(d);
    const label = i === 0
      ? `Сегодня, ${d.getDate()} ${monthShort(d.getMonth())}`
      : `${weekdayShort(d)} ${d.getDate()} ${monthShort(d.getMonth())}`;
    dates.push({ iso, label });
  }
  return dates;
}

const DATE_RANGE = buildDateRange();

function cheapestFare(trips) {
  const withSeats = trips.filter(t => t.seatsLeft > 0);
  if (withSeats.length === 0) return null; // sold out
  return Math.min(...withSeats.map(t => t.price));
}

// Fetches a real price per date in the 7-day range, independently and in
// parallel — each cell reveals its price as soon as its own request
// resolves rather than waiting on the slowest one. Goes through the same
// tripsCache the results screen uses, so a date already priced here isn't
// re-fetched when the user picks it, and vice versa.
function useDateStripPrices(dates) {
  const [prices, setPrices] = React.useState({}); // iso -> 'loading' | number | null

  React.useEffect(() => {
    let cancelled = false;
    setPrices(Object.fromEntries(dates.map(d => [d.iso, 'loading'])));
    dates.forEach(({ iso }) => {
      getTripsForDate(iso)
        .then(trips => {
          if (cancelled) return;
          setPrices(prev => ({ ...prev, [iso]: cheapestFare(trips) }));
        })
        .catch(err => {
          if (cancelled) return;
          console.error(`[SearchScreen] failed to load price for ${iso}`, err);
          setPrices(prev => ({ ...prev, [iso]: null }));
        });
    });
    return () => { cancelled = true; };
  }, [dates]);

  return prices;
}

// Today's departures with live seat counts — fetched for the real current
// date, going through the same tripsCache as the strip/calendar/results
// screen, so this is typically already cached (BookingContext's default
// search date is today) rather than an extra request.
function useTodayTrips() {
  const [state, setState] = React.useState({ status: 'loading', trips: [] });

  React.useEffect(() => {
    let cancelled = false;
    const todayIso = toISO(todayDate());
    getTripsForDate(todayIso)
      .then(trips => {
        if (cancelled) return;
        setState({ status: 'success', trips: [...trips].sort((a, b) => a.depart.localeCompare(b.depart)) });
      })
      .catch(err => {
        if (cancelled) return;
        console.error('[SearchScreen] failed to load today\'s departures', err);
        setState({ status: 'error', trips: [] });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}

export function SearchScreen() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { form, setForm } = useBooking();
  const [activeDateIso, setActiveDateIso] = React.useState(DATE_RANGE[0].iso);
  const stripPrices = useDateStripPrices(DATE_RANGE);

  function onSearch() {
    navigate('/results');
  }

  return (
    <div>
      <section style={{
        background: 'linear-gradient(160deg, var(--maroon-800), var(--maroon-600))',
        padding: '32px 24px 80px',
      }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <h1 style={{ fontSize: isMobile ? 'var(--text-h1)' : 'var(--text-display)', fontWeight: 'var(--fw-extrabold)', color: '#fff', lineHeight: 'var(--lh-display)', letterSpacing: 'var(--ls-tight)', maxWidth: 640 }}>
            МИНСК — МОСКВА
          </h1>
          <p style={{ fontSize: 'var(--text-body)', color: 'var(--neutral-200)', marginTop: 10, maxWidth: 520 }}>
            Билеты на автобус без лишних хлопот — сравнивайте рейсы по времени и цене и оплачивайте картой за пару минут.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 'var(--container-max)', margin: '-52px auto 0', padding: '0 24px' }}>
        <div style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)', padding: isMobile ? 20 : 28,
          display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: 16, alignItems: 'end',
        }}>
          <Field label="Дата отправления">
            <CalendarField value={form.date} onPick={(label, dateISO) => { setForm({ date: label, dateISO }); onSearch(); }} />
          </Field>
          <button onClick={onSearch} style={{
            height: 46, padding: '0 28px', border: 'none', borderRadius: 'var(--radius-md)',
            background: 'var(--brand-primary)', color: '#fff', fontWeight: 'var(--fw-semibold)',
            fontSize: 'var(--text-body)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            boxShadow: 'var(--shadow-brand)',
          }}>
            Найти билеты
          </button>
        </div>

        {/* Per-date price strip — forward-looking only */}
        <div style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
          marginTop: 14, padding: '14px 16px', display: 'flex', gap: 10, overflowX: 'auto',
        }}>
          {DATE_RANGE.map(d => {
            const isActive = d.iso === activeDateIso;
            const priceState = stripPrices[d.iso];
            return (
              <button key={d.iso} onClick={() => setActiveDateIso(d.iso)} style={{
                flex: '0 0 auto', minWidth: 110, padding: '10px 14px', borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                background: isActive ? 'var(--pink-50)' : 'transparent',
                cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left',
              }}>
                <div style={{ fontSize: 'var(--text-xs)', color: isActive ? 'var(--pink-700)' : 'var(--text-tertiary)', fontWeight: 'var(--fw-medium)' }}>{d.label}</div>
                {priceState === 'loading' || priceState === undefined ? (
                  <div style={{
                    height: 16, width: 52, marginTop: 4, borderRadius: 4,
                    background: 'linear-gradient(90deg, var(--neutral-100) 25%, var(--neutral-200) 50%, var(--neutral-100) 75%)',
                    backgroundSize: '80px 100%', animation: 'kt-shimmer 1.1s linear infinite',
                  }} />
                ) : priceState === null ? (
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-tertiary)', marginTop: 2 }}>нет мест</div>
                ) : (
                  <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-bold)', color: isActive ? 'var(--pink-600)' : 'var(--text-primary)', marginTop: 2 }}>{priceState} BYN</div>
                )}
              </button>
            );
          })}
        </div>

        <TodayTrips />

        <div style={{ display: 'flex', gap: 32, marginTop: 56, marginBottom: 56, flexWrap: 'wrap' }}>
          {[
            ['shield-check', 'Проверенные перевозчики', 'Каждый рейс — с реальным рейтингом пунктуальности и комфорта'],
            ['smartphone', 'Электронный билет мгновенно', 'Билет приходит на телефон сразу после оплаты картой или через ЕРИП'],
            ['armchair', 'Схема салона перед покупкой', 'Смотрите свободные места и выбирайте нужное до оплаты'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ flex: '1 1 240px', display: 'flex', gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--pink-50)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name={icon} size={20} color="var(--pink-600)" />
              </div>
              <div>
                <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-body)', color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TodayTrips() {
  const { status, trips } = useTodayTrips();
  const todayLabel = React.useMemo(() => formatRussianDateShort(todayDate()), []);

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-h3)', marginBottom: 4 }}>Рейсы сегодня</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 16 }}>{todayLabel} — актуальное наличие мест</div>
      <div style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}>
        {status === 'loading' ? (
          <div style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Загрузка…</div>
        ) : status === 'error' ? (
          <div style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Не удалось загрузить рейсы на сегодня.</div>
        ) : trips.length === 0 ? (
          <div style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>На сегодня рейсов не найдено.</div>
        ) : trips.map((t, i) => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <span style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--fw-bold)', minWidth: 60 }}>{t.depart}</span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{t.operator}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)', minWidth: 64, textAlign: 'right' }}>{t.price} BYN</span>
              <Badge tone={t.seatsLeft > 5 ? 'success' : t.seatsLeft > 0 ? 'warning' : 'error'}>
                {t.seatsLeft > 0 ? `${t.seatsLeft} мест` : 'Мест нет'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
