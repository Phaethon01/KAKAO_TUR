import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Badge } from '../../design-system/index.js';
import { useIsMobile } from '../useIsMobile.js';
import { useBooking } from '../BookingContext.jsx';

const TAKEN = new Set([3, 7, 12, 18, 22]);

export function SeatSelectionScreen() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { trip, selectedSeats, toggleSeat } = useBooking();

  if (!trip) return <Navigate to="/results" replace />;

  const rows = 11;
  const seatId = (row, col) => row * 4 + col + 1;

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '32px 24px 64px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 320px', gap: isMobile ? 20 : 32 }}>
      <div>
        <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--fw-bold)', marginBottom: 4 }}>Выберите места</h2>
        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 24 }}>
          {trip.depart} → {trip.arrive} · {trip.operator}
        </div>

        <div style={{
          background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)',
          padding: '20px 28px 28px', maxWidth: 360, position: 'relative',
        }}>
          {/* front of bus: rounded nose + driver seat/wheel + door */}
          <div style={{
            border: '2px solid var(--border-default)', borderBottom: 'none',
            borderRadius: '40px 40px 0 0', padding: '14px 16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', border: '2px solid var(--maroon-600)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--maroon-600)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
                </svg>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 'var(--fw-medium)' }}>Водитель</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, border: '2px dashed var(--border-strong)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--maroon-600)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 'var(--fw-medium)' }}>Вход</span>
            </div>
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10,
            border: '2px solid var(--border-default)', borderTop: 'none', borderRadius: '0 0 14px 14px',
            padding: '18px 16px 16px',
          }}>
            {Array.from({ length: rows }).map((_, row) => (
              <div key={row} style={{ display: 'flex', gap: 10 }}>
                {[0, 1].map(col => <Seat key={col} id={seatId(row, col)} selected={selectedSeats} onToggleSeat={toggleSeat} />)}
                <div style={{ width: 20 }} />
                {[2, 3].map(col => <Seat key={col} id={seatId(row, col)} selected={selectedSeats} onToggleSeat={toggleSeat} />)}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 20, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          <Legend tone="available" label="Свободно" />
          <Legend tone="selected" label="Выбрано" />
          <Legend tone="taken" label="Занято" />
        </div>
      </div>

      <div>
        <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: 24, position: isMobile ? 'static' : 'sticky', top: 90 }}>
          <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--text-lg)', marginBottom: 14 }}>Ваш заказ</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 16 }}>
            {trip.depart} — {trip.arrive}, {trip.operator}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            {selectedSeats.length === 0 ? <Badge tone="neutral">Места не выбраны</Badge> : selectedSeats.map(s => <Badge key={s} tone="brand">Место {s}</Badge>)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-body)', marginBottom: 6 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{selectedSeats.length} × {trip.price} BYN</span>
            <span style={{ fontWeight: 'var(--fw-semibold)' }}>{selectedSeats.length * trip.price} BYN</span>
          </div>
          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '14px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-h3)', fontWeight: 'var(--fw-bold)', marginBottom: 20 }}>
            <span>Итого</span><span style={{ color: 'var(--brand-primary)' }}>{selectedSeats.length * trip.price} BYN</span>
          </div>
          <Button variant="primary" fullWidth disabled={selectedSeats.length === 0} onClick={() => navigate('/checkout')}>Оформить заказ</Button>
        </div>
      </div>
    </div>
  );
}

function Seat({ id, selected, onToggleSeat }) {
  const isTaken = TAKEN.has(id);
  const isSelected = selected.includes(id);

  const base = {
    width: 40, height: 40, borderRadius: 9, fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)',
    fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  let style;
  if (isSelected) {
    style = { ...base, border: '1.5px solid var(--pink-500)', background: 'var(--pink-500)', color: '#fff', cursor: 'pointer', boxShadow: '0 2px 6px rgba(226,17,92,0.35)' };
  } else if (isTaken) {
    style = { ...base, border: 'none', background: 'var(--neutral-300)', color: 'var(--neutral-500)', opacity: 0.5, cursor: 'not-allowed' };
  } else {
    style = { ...base, border: '1.5px solid var(--border-strong)', background: 'var(--surface-card)', color: 'var(--text-primary)', cursor: 'pointer' };
  }

  return (
    <button disabled={isTaken} onClick={() => onToggleSeat(id)} style={style}>
      {isTaken ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      ) : id}
    </button>
  );
}

function Legend({ tone, label }) {
  const swatch = {
    available: { border: '1.5px solid var(--border-strong)', background: 'var(--surface-card)' },
    selected: { border: '1.5px solid var(--pink-500)', background: 'var(--pink-500)' },
    taken: { border: 'none', background: 'var(--neutral-300)', opacity: 0.5 },
  }[tone];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 20, height: 20, borderRadius: 6, ...swatch }} />
      {label}
    </div>
  );
}
