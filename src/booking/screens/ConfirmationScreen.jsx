import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Badge } from '../../design-system/index.js';
import { useBooking } from '../BookingContext.jsx';

export function ConfirmationScreen() {
  const navigate = useNavigate();
  const { trip, selectedSeats, passenger, reset } = useBooking();

  if (!trip) return <Navigate to="/" replace />;

  function onBackHome() {
    reset();
    navigate('/');
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '56px 24px 80px', textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', background: 'var(--status-success-bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M4 12.5L9.5 18L20 6" stroke="var(--status-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 style={{ fontSize: 'var(--text-h1)', fontWeight: 'var(--fw-extrabold)', marginBottom: 8 }}>Билет забронирован</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
        Билет готов — скачайте его прямо сейчас и покажите водителю при посадке.
      </p>

      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 28, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>№ KT-2847-1930</div>
          <Badge tone="success">Оплачено</Badge>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--fw-bold)' }}>{trip.depart}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Минск, автовокзал</div>
          </div>
          <div style={{ color: 'var(--text-tertiary)', alignSelf: 'center' }}>→</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--fw-bold)' }}>{trip.arrive}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Москва, {trip.arriveStation}</div>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '14px 0' }} />
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span>Перевозчик: {trip.operator}</span>
          <span>Пассажир: {passenger.first || 'Иван'} {passenger.last || 'Иванов'}</span>
          <span>Места: {selectedSeats.map(s => s.number).join(', ')}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
        <Button variant="primary" size="lg">Скачать билет</Button>
        <Button variant="outline" size="lg" onClick={onBackHome}>Вернуться на главную</Button>
      </div>
    </div>
  );
}
