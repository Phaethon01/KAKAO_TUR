import React from 'react';

export function Switch({ checked, onChange, label, disabled = false }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: 40, height: 24, borderRadius: 'var(--radius-full)',
          background: checked ? 'var(--brand-primary)' : 'var(--neutral-300)',
          position: 'relative', transition: 'background var(--duration-fast) var(--ease-standard)', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: checked ? 19 : 3,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          boxShadow: 'var(--shadow-sm)', transition: 'left var(--duration-fast) var(--ease-standard)',
        }} />
      </span>
      {label ? <span style={{ fontSize: 'var(--text-body)', color: 'var(--text-primary)' }}>{label}</span> : null}
    </label>
  );
}
