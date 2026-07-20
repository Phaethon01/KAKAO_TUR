import React from 'react';

export function Checkbox({ label, checked, onChange, disabled = false }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: 20, height: 20, borderRadius: '6px',
          border: `1.5px solid ${checked ? 'var(--brand-primary)' : 'var(--border-default)'}`,
          background: checked ? 'var(--brand-primary)' : 'var(--surface-card)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background var(--duration-fast), border-color var(--duration-fast)',
          flexShrink: 0,
        }}
      >
        {checked ? (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      {label ? <span style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)' }}>{label}</span> : null}
    </label>
  );
}
