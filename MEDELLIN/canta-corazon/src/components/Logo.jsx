import { CUPIDO, LEMA, NOMBRE } from '../lib/logoPath';

const P = ({ o, className, label }) => (
  <svg viewBox={`0 0 ${o.w} ${o.h}`} className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
    <path d={o.d} fill="currentColor" fillRule="evenodd" />
  </svg>
);
/** Partes del logo original (vectorizado): cupido, nombre y lema. */
export const Cupido = ({ className = '' }) => <P o={CUPIDO} className={`cupido ${className}`} />;
export const Nombre = ({ className = '' }) => <P o={NOMBRE} className={`nombre ${className}`} label="Canta Corazón" />;
export const Lema = ({ className = '' }) => <P o={LEMA} className={`lema ${className}`} />;
export function Logo({ className = '' }) {
  return <span className={`logo ${className}`}><Cupido /><Nombre /><Lema /></span>;
}
export const WaIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.3z" /></svg>
);
