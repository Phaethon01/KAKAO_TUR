import React from 'react';

export function Tooltip({ children, label, position = 'top' }) {
  const [show, setShow] = React.useState(false);
  const positions = {
    top: { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
  };
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show ? (
        <span style={{
          position: 'absolute', ...positions[position], zIndex: 50,
          background: 'var(--maroon-900)', color: 'var(--text-inverse)',
          padding: '6px 10px', borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--text-xs)', whiteSpace: 'nowrap',
          boxShadow: 'var(--shadow-md)',
        }}>
          {label}
        </span>
      ) : null}
    </span>
  );
}
