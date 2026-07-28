import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox } from '../../design-system/index.js';
import { useIsMobile } from '../useIsMobile.js';
import { useBooking } from '../BookingContext.jsx';
import { useModals } from '../ModalContext.jsx';
import { HoldTimer } from '../Chrome.jsx';

function BorderWarning() {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{
      background: 'var(--status-warning-bg)', border: '1px solid rgba(198,124,20,0.3)',
      borderRadius: 'var(--radius-md)', marginBottom: 18, overflow: 'hidden',
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--status-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--status-warning)' }}>
          Пересечение границы — важно
        </span>
        <span style={{ color: 'var(--status-warning)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-fast)' }}>▾</span>
      </button>
      {open ? (
        <div style={{ padding: '0 16px 14px 44px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-body)' }}>
          При отказе в пересечении границы стоимость билета не возвращается. Заранее проверьте паспорт и документы, необходимые для въезда в Российскую Федерацию.
        </div>
      ) : null}
    </div>
  );
}

export function PassengerScreen() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { trip, selectedSeats, passenger, updatePassenger } = useBooking();
  const { openTerms } = useModals();

  if (!trip) return <Navigate to="/results" replace />;

  return (
    <div style={{
      maxWidth: 'var(--container-max)', margin: '0 auto', padding: '32px 24px 64px',
      display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 320px', gap: isMobile ? 20 : 32,
    }}>
      <div>
        <h2 style={{ fontSize: isMobile ? 'var(--text-h3)' : 'var(--text-h2)', fontWeight: 'var(--fw-bold)', marginBottom: 20 }}>Данные пассажира</h2>
        <BorderWarning />
        <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: isMobile ? 20 : 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 18, marginBottom: 24 }}>
            <Input label="Имя" placeholder="Иван" value={passenger.first} onChange={e => updatePassenger('first', e.target.value)} />
            <Input label="Фамилия" placeholder="Иванов" value={passenger.last} onChange={e => updatePassenger('last', e.target.value)} />
            <Input label="Отчество" placeholder="Иванович" value={passenger.middle} onChange={e => updatePassenger('middle', e.target.value)} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <Input label="Телефон" placeholder="+375 29 000-00-00" value={passenger.phone} onChange={e => updatePassenger('phone', e.target.value)} />
          </div>
          <Checkbox label="Согласен с условиями перевозки и обработкой данных" checked={true} onChange={() => {}} />
        </div>
      </div>

      <div>
        <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: 24, position: isMobile ? 'static' : 'sticky', top: 90 }}>
          <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-lg)', marginBottom: 14 }}>Ваш заказ</div>
          <HoldTimer />
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 8 }}>{trip.depart} → {trip.arrive}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 18 }}>Места: {selectedSeats.map(s => s.number).join(', ')}</div>
          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '14px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-h3)', fontWeight: 'var(--fw-bold)', marginBottom: 20 }}>
            <span>Итого</span><span style={{ color: 'var(--brand-primary)' }}>{selectedSeats.length * trip.price} BYN</span>
          </div>
          <Button variant="primary" fullWidth onClick={() => navigate('/payment')}>Перейти к оплате</Button>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); openTerms(); }} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textDecoration: 'underline' }}>Условия возврата и обмена</a>
          </div>
        </div>
      </div>
    </div>
  );
}
