import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../design-system/index.js';
import { useIsMobile } from './useIsMobile.js';

export function Header() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const goHome = () => navigate('/');
  return (
    <header style={{
      background: 'var(--surface-card)', borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{
        maxWidth: 'var(--container-max)', margin: '0 auto', padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div style={{ cursor: 'pointer' }} onClick={goHome}>
          <Logo size={isMobile ? 32 : 38} wordmark={!isMobile} />
        </div>
        {!isMobile ? (
          <nav style={{ display: 'flex', gap: 28 }}>
            {[['search', 'Билеты'], ['info', 'Информация'], ['contacts', 'Контакты']].map(([key, label]) => (
              <span key={key} onClick={goHome} style={{
                fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)',
                color: key === 'search' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}>{label}</span>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}

const BOOKING_STEPS = ['Поиск', 'Места', 'Данные', 'Оплата'];

export function BookingSteps({ current }) {
  return (
    <div style={{ background: 'var(--surface-card)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{
        maxWidth: 'var(--container-max)', margin: '0 auto', padding: '10px 24px',
        display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto',
      }}>
        {BOOKING_STEPS.map((label, i) => {
          const done = i < current, active = i === current;
          return (
            <React.Fragment key={label}>
              {i > 0 ? <span style={{ color: 'var(--neutral-300)', flexShrink: 0 }}>›</span> : null}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700,
                  background: done || active ? 'var(--brand-primary)' : 'var(--surface-sunken)',
                  color: done || active ? '#fff' : 'var(--text-tertiary)',
                }}>
                  {done ? (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6" /></svg>
                  ) : i + 1}
                </span>
                <span style={{
                  fontSize: 'var(--text-xs)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)',
                  color: active ? 'var(--text-primary)' : done ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                }}>{label}</span>
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function HoldTimer() {
  const [sec, setSec] = React.useState(30 * 60 - 47);
  React.useEffect(() => {
    const t = setInterval(() => setSec(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
      background: 'var(--pink-50)', borderRadius: 'var(--radius-md)', marginBottom: 16,
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--pink-700)' }}>{mm}:{ss}</span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--pink-700)', lineHeight: 1.35 }}>Места удержаны за вами, пока вы оформляете заказ</span>
    </div>
  );
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--maroon-900)', color: 'var(--neutral-100)', marginTop: 64 }}>
      <div style={{
        maxWidth: 'var(--container-max)', margin: '0 auto', padding: '40px 24px',
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24,
      }}>
        <div>
          <Logo size={34} />
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', marginTop: 10, maxWidth: 260 }}>
            Онлайн-продажа автобусных билетов на направлении Минск — Москва.
          </div>
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-300)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-400)', textTransform: 'uppercase', letterSpacing: 'var(--ls-wide)', marginBottom: 2 }}>Связаться с нами</span>
          <a href="#" style={{ color: 'var(--neutral-100)' }}>Telegram</a>
          <a href="#" style={{ color: 'var(--neutral-100)' }}>Instagram</a>
          <a href="#" style={{ color: 'var(--neutral-100)' }}>Viber</a>
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-300)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span>Оплата: карта, ЕРИП</span>
          <span>Электронный билет на телефон</span>
          <a href="#" style={{ color: 'var(--neutral-100)' }}>Условия возврата и обмена</a>
        </div>
      </div>
    </footer>
  );
}
