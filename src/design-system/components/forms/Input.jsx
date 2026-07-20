import React from 'react';

export function Input({ label, placeholder, value, onChange, icon, error, helpText, type = 'text', size = 'md' }) {
  const [focused, setFocused] = React.useState(false);
  const heights = { sm: 38, md: 46, lg: 54 };
  return (
    <label style={{ display: 'block', width: '100%' }}>
      {label ? (
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          {label}
        </div>
      ) : null}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        height: heights[size],
        padding: '0 14px',
        borderRadius: 'var(--radius-md)',
        border: `1.5px solid ${error ? 'var(--status-error)' : focused ? 'var(--border-focus)' : 'var(--border-default)'}`,
        background: 'var(--surface-card)',
        boxShadow: focused ? 'var(--focus-ring)' : 'none',
        transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
      }}>
        {icon ? <span style={{ color: 'var(--text-tertiary)', display: 'flex' }}>{icon}</span> : null}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            border: 'none', outline: 'none', flex: 1, background: 'transparent',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--text-primary)',
          }}
        />
      </div>
      {(error || helpText) ? (
        <div style={{ marginTop: '6px', fontSize: 'var(--text-xs)', color: error ? 'var(--status-error)' : 'var(--text-tertiary)' }}>
          {error || helpText}
        </div>
      ) : null}
    </label>
  );
}
