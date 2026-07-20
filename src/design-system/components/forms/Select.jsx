import React from 'react';

export function Select({ label, options = [], value, onChange, placeholder = 'Выбрать' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const current = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      {label ? (
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          {label}
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', height: 46, padding: '0 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${open ? 'var(--border-focus)' : 'var(--border-default)'}`,
          background: 'var(--surface-card)', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: current ? 'var(--text-primary)' : 'var(--text-tertiary)',
          boxShadow: open ? 'var(--focus-ring)' : 'none',
        }}
      >
        <span>{current ? current.label : placeholder}</span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-fast)', color: 'var(--text-tertiary)' }}>▾</span>
      </button>
      {open ? (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 20,
          background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
        }}>
          {options.map(o => (
            <div
              key={o.value}
              onClick={() => { onChange && onChange(o.value); setOpen(false); }}
              style={{
                padding: '10px 14px', cursor: 'pointer', fontSize: 'var(--text-body)',
                color: o.value === value ? 'var(--brand-primary)' : 'var(--text-primary)',
                background: o.value === value ? 'var(--pink-50)' : 'transparent',
                fontWeight: o.value === value ? 'var(--fw-semibold)' : 'var(--fw-regular)',
              }}
              onMouseEnter={e => { if (o.value !== value) e.currentTarget.style.background = 'var(--surface-sunken)'; }}
              onMouseLeave={e => { if (o.value !== value) e.currentTarget.style.background = 'transparent'; }}
            >
              {o.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
