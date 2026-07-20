import React from 'react';

export function Tabs({ tabs, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '4px', borderBottom: '1.5px solid var(--border-subtle)' }}>
      {tabs.map(t => {
        const isActive = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange && onChange(t.value)}
            style={{
              padding: '12px 18px', border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)',
              fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-regular)',
              color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: `2.5px solid ${isActive ? 'var(--brand-primary)' : 'transparent'}`,
              marginBottom: '-1.5px',
              transition: 'color var(--duration-fast)',
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
