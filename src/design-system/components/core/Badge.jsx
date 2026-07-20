import React from 'react';

export function Badge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: { background: 'var(--surface-sunken)', color: 'var(--text-secondary)' },
    brand: { background: 'var(--pink-50)', color: 'var(--pink-600)' },
    success: { background: 'var(--status-success-bg)', color: 'var(--status-success)' },
    warning: { background: 'var(--status-warning-bg)', color: 'var(--status-warning)' },
    error: { background: 'var(--status-error-bg)', color: 'var(--status-error)' },
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 10px', borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase',
      ...tones[tone],
    }}>
      {children}
    </span>
  );
}
