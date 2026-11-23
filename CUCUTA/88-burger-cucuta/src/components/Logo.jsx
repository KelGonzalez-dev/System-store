import { useId } from 'react';

/** Sello de 88 Burger (recreado en vector a partir del logo de su Instagram). ⚠️ Reemplazable por el logo original. */
export function Sello({ className = '', anillo = true }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 220 220" className={`sello ${className}`} role="img" aria-label="88 Burger">
      <defs>
        <path id={`a${id}`} d="M110 110 m-78 0 a78 78 0 1 1 156 0" />
        <path id={`b${id}`} d="M110 110 m-84 0 a84 84 0 0 0 168 0" />
        <radialGradient id={`r${id}`} cx="50%" cy="38%" r="70%"><stop offset="0" stopColor="#F2373C" /><stop offset="1" stopColor="#B5161C" /></radialGradient>
      </defs>
      <circle cx="110" cy="110" r="106" fill="#120E0C" />
      <circle cx="110" cy="110" r="98" fill={`url(#r${id})`} />
      {anillo && <circle cx="110" cy="110" r="64" fill="none" stroke="#FFF4E0" strokeWidth="2" opacity=".5" />}
      <text fontFamily="Bowlby One, sans-serif" fontSize="25" fill="#FFF4E0" letterSpacing="3">
        <textPath href={`#a${id}`} startOffset="50%" textAnchor="middle">88 BURGER</textPath>
      </text>
      <text fontFamily="Onest Variable, sans-serif" fontWeight="800" fontSize="12" fill="#FFC531" letterSpacing="4">
        <textPath href={`#b${id}`} startOffset="50%" textAnchor="middle">SABORES PREMIUM</textPath>
      </text>
      <g transform="translate(62 66) scale(.48)">
        <path d="M30 92c0-34 32-56 70-56s70 22 70 56z" fill="#F0A93C" />
        {[[70, 60], [95, 52], [120, 58], [82, 72], [110, 70], [140, 72]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="4.5" ry="2.6" fill="#FFF2D6" />)}
        <path d="M26 98c12-6 20 6 32 0s20 6 32 0 20 6 32 0 20 6 32 0 14 4 20 0v8H26z" fill="#57C35A" />
        <path d="M24 104h152l-14 18H38z" fill="#FFC531" />
        <rect x="28" y="110" width="144" height="24" rx="12" fill="#4A2416" />
        <path d="M34 140h132c0 14-14 24-32 24H66c-18 0-32-10-32-24z" fill="#E09636" />
      </g>
    </svg>
  );
}

/** Logo del menú: sello + nombre */
export function Logo({ compact = false }) {
  return (
    <span className="logo">
      <Sello className="logo__sello" anillo={false} />
      {!compact && <span className="logo__txt"><b>88</b> BURGER</span>}
    </span>
  );
}

export const WaIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 1-2.3.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6-.3.3c-.1.2-.3.3-.1.6.2.3.8 1.3 1.8 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.6-.1 1.3z" /></svg>
);
