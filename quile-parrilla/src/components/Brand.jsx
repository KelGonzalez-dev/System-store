import { QUILE_PATH } from '../lib/logoPath';

// Llama del punto de la "i" (dibujada aparte para poder animarla)
export function Flame({ className = '' }) {
  return (
    <g className={`flame ${className}`}>
      <path className="flame-out" d="M418 112c-20 0-32-14-32-31 0-15 9-24 15-33 1 9 5 14 10 16-1-16 6-31 20-42-3 14 3 23 9 31 7 9 11 17 11 27 0 19-14 32-33 32z" fill="#FF7A1A" />
      <path className="flame-in" d="M419 110c-10 0-17-7-17-17 0-8 5-13 9-18 1 6 4 9 8 10 0-9 4-16 11-21-1 8 2 13 5 17 3 4 5 9 5 13 0 10-8 16-21 16z" fill="#FFC447" />
    </g>
  );
}

// Logo "Quile" (trazo original) + llama + tablilla de madera "PARRILLA"
export function QuileLogo({ className = '', plank = true, glow = true, title = 'Quile Parrilla' }) {
  return (
    <svg viewBox={`0 0 610 ${plank ? 400 : 300}`} className={`quile-logo ${glow ? 'has-glow' : ''} ${className}`} role="img" aria-label={title}>
      <defs>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9C88E" />
          <stop offset=".55" stopColor="#D2A866" />
          <stop offset="1" stopColor="#A97C42" />
        </linearGradient>
      </defs>
      <path className="ql-word" d={QUILE_PATH} fillRule="evenodd" />
      <Flame />
      {plank && (
        <g className="ql-plank">
          <rect x="300" y="300" width="290" height="62" rx="5" fill="url(#wood)" stroke="#6B4523" strokeWidth="3" />
          <path d="M310 318h270M310 344h270" stroke="#B88A50" strokeWidth="1.5" opacity=".5" />
          <circle cx="318" cy="331" r="4.5" fill="#4A2E16" /><circle cx="572" cy="331" r="4.5" fill="#4A2E16" />
          <text x="445" y="345" textAnchor="middle" className="ql-plank-text">PARRILLA</text>
        </g>
      )}
    </svg>
  );
}
