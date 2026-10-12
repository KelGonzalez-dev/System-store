// Marca BELO: letras altas y finas (como su logo) + "COCINA & TRAGOS"
export function Wordmark({ className = '', sub = true, title = 'BELO · Cocina & Rooftop' }) {
  return (
    <svg viewBox="0 0 300 160" className={`wordmark ${className}`} role="img" aria-label={title}>
      <text x="150" y="118" textAnchor="middle" className="wm-belo">BELO</text>
      {sub && <text x="150" y="146" textAnchor="middle" className="wm-sub">COCINA &amp; TRAGOS</text>}
    </svg>
  );
}

// Adorno art déco (como el de su carta)
export function Deco({ className = '' }) {
  return (
    <svg viewBox="0 0 40 40" className={`deco ${className}`} aria-hidden="true">
      <path d="M20 2l6 12 12 6-12 6-6 12-6-12L2 20l12-6z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M20 10l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="currentColor" opacity=".85" />
    </svg>
  );
}
