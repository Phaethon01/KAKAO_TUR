import React from 'react';

export function Dialog({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(28, 23, 20, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 440, maxWidth: '90vw', background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
          padding: '28px', maxHeight: '85vh', overflow: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--fw-bold)', color: 'var(--text-primary)' }}>{title}</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-tertiary)' }}>×</button>
        </div>
        <div>{children}</div>
        {footer ? <div style={{ marginTop: '22px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>{footer}</div> : null}
      </div>
    </div>
  );
}
