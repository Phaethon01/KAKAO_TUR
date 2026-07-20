import React from 'react';

/**
 * KAKAO-TUR brand mark — refined redraw of the original icon (kept literally:
 * pink circle outline, solid-pink 5-petal folded flower, white sailboat
 * silhouette nested in negative space at the center) with smoother curves,
 * consistent stroke weight, and an even rosette for small-size legibility.
 * Wordmark: "KAKAO-" in pink / "TUR" in white, bold condensed, on a dark
 * maroon rounded pill (per brand lockup reference).
 */
export function Logo({ size = 40, wordmark = true }) {
  const pink = 'var(--pink-500)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="44" fill="none" stroke={pink} strokeWidth="6.5" />
        <path d="M50 50 C41 43 37 26 46 10 C61 18 59 38 50 50 Z" fill={pink} />
        <path d="M50 50 C41 43 37 26 46 10 C61 18 59 38 50 50 Z" fill={pink} transform="rotate(72 50 50)" />
        <path d="M50 50 C41 43 37 26 46 10 C61 18 59 38 50 50 Z" fill={pink} transform="rotate(144 50 50)" />
        <path d="M50 50 C41 43 37 26 46 10 C61 18 59 38 50 50 Z" fill={pink} transform="rotate(216 50 50)" />
        <path d="M50 50 C41 43 37 26 46 10 C61 18 59 38 50 50 Z" fill={pink} transform="rotate(288 50 50)" />
        <circle cx="50" cy="50" r="24" fill={pink} />
        <path d="M51 32 L51 53 L36 53 Z" fill="#fff" />
        <path d="M37 56 L63 56 L56 63 L42 63 Z" fill="#fff" />
      </svg>
      {wordmark ? (
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'var(--maroon-900)', borderRadius: 'var(--radius-md)',
          padding: '6px 14px',
        }}>
          <span style={{
            fontSize: size * 0.5, fontWeight: 800, letterSpacing: '-0.01em',
            fontStretch: 'condensed', whiteSpace: 'nowrap', lineHeight: 1,
          }}>
            <span style={{ color: pink }}>KAKAO-</span>
            <span style={{ color: '#fff' }}>TUR</span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
