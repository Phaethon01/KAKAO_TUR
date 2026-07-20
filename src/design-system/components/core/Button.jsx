import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  style: styleOverride,
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--fw-semibold)',
    border: '1.5px solid transparent',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast), transform var(--duration-fast)',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    whiteSpace: 'nowrap',
  };

  const sizes = {
    sm: { padding: '8px 14px', fontSize: 'var(--text-sm)' },
    md: { padding: '12px 20px', fontSize: 'var(--text-body)' },
    lg: { padding: '16px 26px', fontSize: 'var(--text-lg)' },
  };

  const variants = {
    primary: {
      background: 'var(--brand-primary)',
      color: 'var(--text-inverse)',
      borderColor: 'var(--brand-primary)',
    },
    secondary: {
      background: 'var(--brand-secondary)',
      color: 'var(--text-inverse)',
      borderColor: 'var(--brand-secondary)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--brand-primary)',
      borderColor: 'var(--border-default)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      borderColor: 'transparent',
    },
  };

  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const hoverBg = {
    primary: 'var(--brand-primary-hover)',
    secondary: 'var(--brand-secondary-hover)',
    outline: 'var(--surface-sunken)',
    ghost: 'var(--surface-sunken)',
  };
  const activeBg = {
    primary: 'var(--brand-primary-active)',
    secondary: 'var(--brand-secondary-active)',
    outline: 'var(--surface-sunken)',
    ghost: 'var(--border-subtle)',
  };

  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...(hover && !disabled ? { background: hoverBg[variant] } : {}),
    ...(active && !disabled ? { background: activeBg[variant], transform: 'scale(0.98)' } : {}),
    ...styleOverride,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      {icon && iconPosition === 'left' ? icon : null}
      {children}
      {icon && iconPosition === 'right' ? icon : null}
    </button>
  );
}
