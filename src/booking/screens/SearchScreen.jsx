import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Badge } from '../../design-system/index.js';
import { useIsMobile } from '../useIsMobile.js';
import { useBooking } from '../BookingContext.jsx';
import { CalendarField } from '../CalendarField.jsx';

// Forward-looking dates only — today (17 июля) through the next 6 days.
const DATES = [
  { label: 'Сегодня, 17 июл', price: 40, active: true },
  { label: 'Сб 18 июл', price: 45 },
  { label: 'Вс 19 июл', price: 45 },
  { label: 'Пн 20 июл', price: 38 },
  { label: 'Вт 21 июл', price: 40 },
  { label: 'Ср 22 июл', price: 45 },
  { label: 'Чт 23 июл', price: 51 },
];

// Today's departures with live seat counts.
const TODAY_TRIPS = [
  { time: '08:00', operator: 'Visit Tour', seatsLeft: 12, price: 40 },
  { time: '13:15', operator: 'Intercars', seatsLeft: 3, price: 42 },
  { time: '22:00', operator: 'Visit Tour', seatsLeft: 0, price: 48 },
];

export function SearchScreen() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { form, setForm } = useBooking();
  const [activeDate, setActiveDate] = React.useState(DATES[0].label);

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
            <CalendarField value={form.date} onPick={(label) => { setForm({ date: label }); onSearch(); }} />
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
          {DATES.map(d => {
            const isActive = d.label === activeDate;
            return (
              <button key={d.label} onClick={() => setActiveDate(d.label)} style={{
                flex: '0 0 auto', minWidth: 110, padding: '10px 14px', borderRadius: 'var(--radius-md)',
                border: `1.5px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                background: isActive ? 'var(--pink-50)' : 'transparent',
                cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left',
              }}>
                <div style={{ fontSize: 'var(--text-xs)', color: isActive ? 'var(--pink-700)' : 'var(--text-tertiary)', fontWeight: 'var(--fw-medium)' }}>{d.label}</div>
                <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--fw-bold)', color: isActive ? 'var(--pink-600)' : 'var(--text-primary)', marginTop: 2 }}>{d.price} BYN</div>
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
  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-h3)', marginBottom: 4 }}>Рейсы сегодня</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 16 }}>17 июля — актуальное наличие мест</div>
      <div style={{
        background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}>
        {TODAY_TRIPS.map((t, i) => (
          <div key={t.time} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <span style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--fw-bold)', minWidth: 60 }}>{t.time}</span>
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
