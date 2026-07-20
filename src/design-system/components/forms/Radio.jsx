import React from 'react';

export function Radio({ label, checked, onChange, name, disabled = false }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
      <span
        onClick={() => !disabled && onChange && onChange()}
        style={{
          width: 20, height: 20, borderRadius: '50%',
          border: `1.5px solid ${checked ? 'var(--brand-primary)' : 'var(--border-default)'}`,
          background: 'var(--surface-card)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transition: 'border-color var(--duration-fast)',
        }}
      >
        {checked ? <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--brand-primary)' }} /> : null}
      </span>
      {label ? <span style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)' }}>{label}</span> : null}
    </label>
  );
}
