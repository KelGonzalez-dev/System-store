import { MD, MD_H, MD_W } from '../lib/logoPath';

// Logo original: óvalo rojo con "MD" (trazo vectorizado de su imagen)
export function MDLogo({ className = '' }) {
  return (
    <svg viewBox={`-3 -3 ${MD_W + 6} ${MD_H + 6}`} className={`md-logo ${className}`} role="img" aria-label="Materiales El Descuento">
      <ellipse cx={MD_W / 2} cy={MD_H / 2} rx={MD_W / 2} ry={MD_H / 2} className="mdl-oval" />
      <path d={MD} fillRule="evenodd" className="mdl-text" />
    </svg>
  );
}

export function Logo({ compact = false }) {
  return (
    <span className="logo">
      <MDLogo />
      {!compact && <span className="logo-t"><b>Materiales</b><b className="red">El Descuento</b><small>S.A.S ZESE</small></span>}
    </span>
  );
}

export const WaIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.3z" /></svg>
);
export const CartIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-none stroke-current`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5h11l-1.5 8.5a2 2 0 0 1-2 1.5H8.6a2 2 0 0 1-2-1.6L4.8 3H2" /><circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" /><path d="M10 9h7" /></svg>
);
