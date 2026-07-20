import React from 'react';

export function Card({ children, padding = 'md', hoverable = false, onClick }) {
  const [hover, setHover] = React.useState(false);
  const paddings = { sm: '16px', md: '24px', lg: '32px' };
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: paddings[padding],
        boxShadow: hover && hoverable ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: hover && hoverable ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </div>
  );
}
