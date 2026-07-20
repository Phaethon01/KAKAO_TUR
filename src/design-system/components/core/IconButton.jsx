import React from 'react';

export function IconButton({ icon, label, size = 'md', variant = 'ghost', onClick, active = false }) {
  const sizes = { sm: 32, md: 40, lg: 48 };
  const dim = sizes[size];
  const [hover, setHover] = React.useState(false);

  const variants = {
    ghost: { background: hover || active ? 'var(--surface-sunken)' : 'transparent', color: 'var(--text-primary)' },
    filled: { background: hover ? 'var(--brand-primary-hover)' : 'var(--brand-primary)', color: 'var(--text-inverse)' },
    outline: { background: hover ? 'var(--surface-sunken)' : 'transparent', color: 'var(--text-primary)', border: '1.5px solid var(--border-default)' },
  };

  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: dim, height: dim,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        border: variant === 'outline' ? undefined : 'none',
        cursor: 'pointer',
        transition: 'background var(--duration-fast) var(--ease-standard)',
        ...variants[variant],
      }}
    >
      {icon}
    </button>
  );
}
