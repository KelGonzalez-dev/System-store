import { GNAM, SWOOSH } from '../lib/logoPath';

// Logo "Gnam" (vector original de su carta) + "DOLCE"
export function GnamLogo({ className = '', dolce = true, title = 'Gnam Dolce' }) {
  return (
    <svg viewBox={dolce ? '183 337 256 136' : '183 337 256 105'} className={`gnam-logo ${className}`} role="img" aria-label={title}>
      <path d={GNAM} className="gl-word" fillRule="evenodd" />
      {dolce && <text x="309" y="466" textAnchor="middle" className="gl-dolce">DOLCE</text>}
    </svg>
  );
}

// La gran "G" curva de la portada de su carta
export function Swoosh({ className = '' }) {
  return (
    <svg viewBox="-80 10 910 770" className={`swoosh ${className}`} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <path d={SWOOSH} fillRule="evenodd" />
    </svg>
  );
}

// Medallón amarillo "Dolce Vita" (como su foto de perfil)
export function DolceVita({ className = '', label = 'Dolce Vita' }) {
  return (
    <span className={`dolce-vita ${className}`} aria-hidden="true">
      <svg viewBox="-60 -60 120 120">
        <defs><path id="dvRing" d="M0 -46a46 46 0 1 1 -0.1 0" /></defs>
        <circle r="58" className="dv-disc" />
        <text className="dv-ring"><textPath href="#dvRing" textLength="286" lengthAdjust="spacing">#TULUGARDULCE · GNAM DOLCE · </textPath></text>
        <text y="7" textAnchor="middle" className="dv-word">{label}</text>
      </svg>
    </span>
  );
}
