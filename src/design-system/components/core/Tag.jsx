import React from 'react';

export function Tag({ children, selected = false, onClick, removable = false, onRemove }) {
  const [hover, setHover] = React.useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '7px 14px', borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)',
        border: `1.5px solid ${selected ? 'var(--brand-primary)' : 'var(--border-default)'}`,
        background: selected ? 'var(--pink-50)' : hover ? 'var(--surface-sunken)' : 'var(--surface-card)',
        color: selected ? 'var(--pink-600)' : 'var(--text-primary)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--duration-fast) var(--ease-standard)',
      }}
    >
      {children}
      {removable ? (
        <span onClick={(e) => { e.stopPropagation(); onRemove && onRemove(); }} style={{ opacity: 0.6, fontWeight: 700 }}>×</span>
      ) : null}
    </span>
  );
}
