import React from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Radio } from '../../design-system/index.js';
import { useIsMobile } from '../useIsMobile.js';
import { useBooking } from '../BookingContext.jsx';
import { useModals } from '../ModalContext.jsx';
import { HoldTimer } from '../Chrome.jsx';
import { PaymentIcons } from '../PaymentIcons.jsx';

export function PaymentScreen() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { trip, selectedSeats, method, setMethod } = useBooking();
  const { openTerms } = useModals();
  const [searchParams] = useSearchParams();
  // ?decline=1 previews the "payment declined" edge state on the first attempt —
  // there is no real payment gateway wired up yet, so this keeps that designed
  // state reachable without ever surfacing in the normal flow.
  const declineOnce = React.useRef(searchParams.get('decline') === '1');
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (!trip) return <Navigate to="/results" replace />;

  function handlePay() {
    setProcessing(true);
    setError(null);
    setTimeout(() => {
      if (declineOnce.current) {
        declineOnce.current = false;
        setProcessing(false);
        setError('Банк отклонил операцию. Средства не списаны — попробуйте ещё раз или выберите другой способ оплаты.');
      } else {
        setProcessing(false);
        navigate('/confirmation');
      }
    }, 1100);
  }

  return (
    <div style={{
      maxWidth: 'var(--container-max)', margin: '0 auto', padding: '32px 24px 64px',
      display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) 320px', gap: isMobile ? 20 : 32,
    }}>
      <div>
        <h2 style={{ fontSize: isMobile ? 'var(--text-h3)' : 'var(--text-h2)', fontWeight: 'var(--fw-bold)', marginBottom: 20 }}>Оплата</h2>
        {error ? (
          <div style={{
            background: 'var(--status-error-bg)', border: '1px solid rgba(194,59,46,0.3)',
            borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 18,
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--status-error)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-bold)', color: 'var(--status-error)', marginBottom: 2 }}>Платёж отклонён</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{error}</div>
            </div>
          </div>
        ) : null}
        <div style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', padding: isMobile ? 20 : 28 }}>
          <div style={{ fontWeight: 'var(--fw-semibold)', marginBottom: 14 }}>Способ оплаты</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
            <Radio label="Банковская карта" checked={method === 'card'} onChange={() => setMethod('card')} />
            <Radio label="ЕРИП" checked={method === 'erip'} onChange={() => setMethod('erip')} />
          </div>
          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0 18px' }} />
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', fontWeight: 'var(--fw-semibold)', marginBottom: 12 }}>
            Принимаем к оплате
          </div>
          <PaymentIcons />
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
          <Button variant="primary" fullWidth disabled={processing} onClick={handlePay}>
            {processing ? 'Обработка платежа…' : `Оплатить ${selectedSeats.length * trip.price} BYN`}
          </Button>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); openTerms(); }} style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textDecoration: 'underline' }}>Условия возврата и обмена</a>
          </div>
        </div>
      </div>
    </div>
  );
}
