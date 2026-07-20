import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Badge, Tag, Button } from '../../design-system/index.js';
import { useIsMobile } from '../useIsMobile.js';
import { useBooking } from '../BookingContext.jsx';

const SORTS = [
  { value: 'time', label: 'По времени отправления' },
  { value: 'price', label: 'По цене' },
];
const RUB_RATE = 27.4;
const NEXT_DATES = [
  { label: 'Сб 18 июл', price: 45 },
  { label: 'Вс 19 июл', price: 45 },
  { label: 'Пн 20 июл', price: 38 },
];

function inWindow(depart, f) {
  if (!f) return true;
  const h = parseInt(depart, 10);
  if (f === 'Утро') return h < 12;
  if (f === 'День') return h >= 12 && h < 18;
  return h >= 18;
}

export function ResultsScreen() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { trips, filter, setFilter, form, setTrip } = useBooking();
  const [searchParams] = useSearchParams();
  // ?empty=1 previews the "no trips on this date" edge state designed for the
  // route — the demo data has no naturally sold-out date, so this stays reachable.
  const noTripsForDate = searchParams.get('empty') === '1';
  const [sort, setSort] = React.useState('time');
  const [cur, setCur] = React.useState('BYN');

  const date = form.date;
  const allTrips = noTripsForDate ? [] : trips;
  const visible = allTrips.filter(t => inWindow(t.depart, filter));
  const sorted = React.useMemo(() => {
    const list = [...visible];
    if (sort === 'price') list.sort((a, b) => a.price - b.price);
    else list.sort((a, b) => a.depart.localeCompare(b.depart));
    return list;
  }, [visible, sort]);
  const withSeats = visible.filter(t => t.seatsLeft > 0);
  const cheapestPrice = withSeats.length ? Math.min(...withSeats.map(t => t.price)) : null;
  const fmt = p => cur === 'BYN' ? `${p} BYN` : `≈ ${Math.round(p * RUB_RATE)} ₽`;

  function onSelect(trip) {
    setTrip(trip);
    navigate('/seats');
  }

  const sortControls = (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', flexWrap: 'wrap', gap: 6, marginBottom: isMobile ? 12 : 24 }}>
      {SORTS.map(s => (
        <button key={s.value} onClick={() => setSort(s.value)} style={{
          textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
          padding: '9px 12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)',
          background: sort === s.value ? 'var(--pink-50)' : 'transparent',
          color: sort === s.value ? 'var(--pink-700)' : 'var(--text-secondary)',
          fontWeight: sort === s.value ? 'var(--fw-semibold)' : 'var(--fw-regular)',
        }}>{s.label}</button>
      ))}
    </div>
  );
  const filterControls = (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {['Утро', 'День', 'Вечер'].map(t => (
        <Tag key={t} selected={filter === t} onClick={() => setFilter(filter === t ? null : t)}>{t}</Tag>
      ))}
    </div>
  );

  return (
    <div style={{
      maxWidth: 'var(--container-max)', margin: '0 auto', padding: '32px 24px 64px',
      display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px minmax(0, 1fr)', gap: isMobile ? 20 : 32,
    }}>
      <aside>
        {!isMobile ? <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-lg)', marginBottom: 16 }}>Сортировка</div> : null}
        {sortControls}
        {!isMobile ? <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-lg)', marginBottom: 16 }}>Фильтры</div> : null}
        {!isMobile ? <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--text-secondary)', marginBottom: 8 }}>Время отправления</div> : null}
        {filterControls}
      </aside>

      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
          <h2 style={{ fontSize: isMobile ? 'var(--text-h3)' : 'var(--text-h2)', fontWeight: 'var(--fw-bold)' }}>Минск → Москва{sorted.length ? `, ${sorted.length} рейса` : ''}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>{date}</span>
            <div style={{ display: 'flex', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-full)', padding: 3 }}>
              {['BYN', 'RUB'].map(c => (
                <button key={c} onClick={() => setCur(c)} style={{
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: cur === c ? 'var(--surface-card)' : 'transparent',
                  color: cur === c ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: cur === c ? 'var(--shadow-sm)' : 'none',
                }}>{c}</button>
              ))}
            </div>
          </div>
        </div>
        {cur === 'RUB' ? (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 12 }}>Цены в ₽ указаны справочно по курсу — оплата производится в BYN.</div>
        ) : <div style={{ marginBottom: 12 }}></div>}

        {sorted.length === 0 ? (
          <EmptyState filter={filter} date={date} onReset={() => setFilter(null)} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sorted.map(trip => {
              const isBest = trip.seatsLeft > 0 && trip.price === cheapestPrice;
              return (
                <Card key={trip.id} hoverable onClick={() => onSelect(trip)} padding={isMobile ? 'sm' : 'md'}>
                  {isBest ? (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14,
                      background: 'var(--status-success-bg)', color: 'var(--status-success)',
                      padding: '4px 10px', borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase',
                    }}>
                      Лучшая цена
                    </div>
                  ) : null}
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 24, flexWrap: 'wrap' }}>
                    <div style={{ minWidth: isMobile ? 0 : 150 }}>
                      <div style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--fw-bold)' }}>{trip.depart}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Минск, автовокзал</div>
                    </div>
                    <div style={{ flex: isMobile ? '0 0 auto' : 1, display: 'flex', alignItems: 'center', color: 'var(--text-tertiary)' }}>
                      <span style={{ fontSize: 16 }}>→</span>
                    </div>
                    <div style={{ minWidth: isMobile ? 0 : 150, textAlign: isMobile ? 'left' : 'right' }}>
                      <div style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--fw-bold)' }}>{trip.arrive}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Москва, {trip.arriveStation}</div>
                    </div>
                    {!isMobile ? <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border-subtle)' }} /> : null}
                    <div style={{
                      minWidth: isMobile ? 0 : 130, textAlign: 'right',
                      flex: isMobile ? '1 1 100%' : '0 0 auto',
                      display: isMobile ? 'flex' : 'block', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                    }}>
                      <Badge tone={trip.seatsLeft > 5 ? 'success' : trip.seatsLeft > 0 ? 'warning' : 'error'}>
                        {trip.seatsLeft > 0 ? `${trip.seatsLeft} мест` : 'Мест нет'}
                      </Badge>
                      <div style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--fw-bold)', color: 'var(--brand-primary)', marginTop: isMobile ? 0 : 8, whiteSpace: 'nowrap' }}>{fmt(trip.price)}</div>
                      <Button size="sm" disabled={trip.seatsLeft === 0}>Выбрать</Button>
                    </div>
                  </div>
                  <div style={{ height: 1, background: 'var(--border-subtle)', margin: '16px 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'var(--fw-medium)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{trip.operator}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ filter, date = '17 июля 2026', onReset }) {
  return (
    <div style={{
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', padding: '48px 28px', textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: 'var(--surface-sunken)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        color: 'var(--text-tertiary)',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      <div style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--fw-bold)', marginBottom: 6 }}>
        {filter ? `Нет рейсов на «${filter.toLowerCase()}»` : 'На эту дату рейсов нет'}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', maxWidth: 380, margin: '0 auto 20px' }}>
        {filter
          ? 'Попробуйте другое время отправления или сбросьте фильтр.'
          : `Все места на ${date.replace(' 2026', '')} распроданы. Посмотрите соседние даты — там ещё есть билеты.`}
      </p>
      {filter ? (
        <Button variant="outline" onClick={onReset}>Сбросить фильтр</Button>
      ) : (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {NEXT_DATES.map(d => (
            <button key={d.label} style={{
              padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-default)',
              background: 'var(--surface-card)', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left',
            }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{d.label}</div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--pink-600)' }}>от {d.price} BYN</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
