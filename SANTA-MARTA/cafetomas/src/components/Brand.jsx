import { HALF, MARK, RING } from '../lib/logoPath';

// Logo de Cafetomás (trazo original): disco morado, símbolo amarillo y "MAESTRÍA EN CAFÉ" en arco
export function Logo({ className = '', disc = true, title = 'Cafetomás · Maestría en café' }) {
  return (
    <svg viewBox={`${-HALF} ${-HALF} ${HALF * 2} ${HALF * 2}`} className={`ct-logo ${className}`} role="img" aria-label={title}>
      {disc && <circle r={HALF * 0.92} className="lg-disc" />}
      <path d={MARK} className="lg-mark" fillRule="evenodd" />
      <path d={RING} className="lg-ring" fillRule="evenodd" />
    </svg>
  );
}

// Solo el símbolo
export function Mark({ className = '' }) {
  return (
    <svg viewBox="-70 -55 115 110" className={`ct-mark ${className}`} aria-hidden="true">
      <path d={MARK} fillRule="evenodd" fill="currentColor" />
    </svg>
  );
}
