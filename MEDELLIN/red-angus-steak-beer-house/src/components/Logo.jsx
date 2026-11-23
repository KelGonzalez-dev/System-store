import { BLANCO, H, PLACA, ROJO, W } from '../lib/logoPath';

/** Letrero original de Red Angus (vectorizado de su logo). */
export function Letrero({ className = '', conEst = true }) {
  const h = conEst ? H : H - 34;
  return (
    <svg viewBox={`0 0 ${W} ${h}`} className={`letrero ${className}`} role="img" aria-label="Red Angus Steak & Beer House">
      <path d={PLACA} fill="#0B0B0B" fillRule="evenodd" />
      <path d={BLANCO} fill="#FFFFFF" fillRule="evenodd" />
      <path d={ROJO} fill="#C8282E" fillRule="evenodd" />
    </svg>
  );
}
