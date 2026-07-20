import React from 'react';
import AlfaBank from '../design-system/assets/payments/AlfaBank.png';
import ApplePay from '../design-system/assets/payments/ApplePay.png';
import BelCard from '../design-system/assets/payments/BelCard.png';
import BelCardPassword from '../design-system/assets/payments/BelCardPassword.png';
import MasterCard from '../design-system/assets/payments/MasterCard.png';
import MasterCardID from '../design-system/assets/payments/MasterCardID.png';
import SamsungPay from '../design-system/assets/payments/SamsungPay.png';
import Visa from '../design-system/assets/payments/Visa.png';
import VisaSecure from '../design-system/assets/payments/VisaSecure.png';

// Multi-line lockups (a small badge of text stacked in 2-3 rows) go
// illegible at the shared row height — bump just these to ~1.5x so the
// text inside them stays readable, still center-aligned against the rest.
const TALL = 1.5;

const ICONS = [
  { src: Visa, alt: 'Visa' },
  { src: VisaSecure, alt: 'Visa Secure', scale: TALL },
  { src: MasterCard, alt: 'Mastercard' },
  { src: MasterCardID, alt: 'Mastercard ID Check' },
  { src: BelCard, alt: 'БЕЛКАРТ', scale: TALL },
  { src: BelCardPassword, alt: 'БЕЛКАРТ Интернет-Пароль', scale: TALL },
  { src: ApplePay, alt: 'Apple Pay' },
  { src: SamsungPay, alt: 'Samsung Pay' },
  { src: AlfaBank, alt: 'Альфа Банк' },
];

// No logo asset exists yet for these two — kept as plain-text chips so the
// full accepted-methods list stays complete rather than silently shrinking.
const TEXT_ONLY = ['E-POS (ЕРИП)', 'Я Pay'];

export function PaymentIcons({ height = 28 }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
      {ICONS.map(icon => (
        <img
          key={icon.alt}
          src={icon.src}
          alt={icon.alt}
          title={icon.alt}
          style={{ height: height * (icon.scale || 1), width: 'auto', objectFit: 'contain', display: 'block' }}
        />
      ))}
      {TEXT_ONLY.map(label => (
        <span key={label} style={{
          display: 'inline-flex', alignItems: 'center', height,
          padding: '0 10px', borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)',
          fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)',
          whiteSpace: 'nowrap',
        }}>{label}</span>
      ))}
    </div>
  );
}
