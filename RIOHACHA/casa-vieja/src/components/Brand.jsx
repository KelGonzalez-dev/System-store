import { CV_PATH } from '../lib/logoPath';

// Sello de Casa Vieja (trazo original) — toma el color del texto (currentColor)
export function CVLogo({ className = '', band = 'var(--logo-band, #1b120d)', title = 'Casa Vieja · Café & Bar' }) {
  return (
    <svg viewBox="-85 -85 170 170" className={`cv-logo ${className}`} role="img" aria-label={title}>
      <path className="cv-ink" d={CV_PATH} fill="currentColor" fillRule="evenodd" />
      <rect x="-33" y="10.8" width="63" height="12.2" rx="6" fill="currentColor" />
      <text x="-1.5" y="19.4" textAnchor="middle" className="cv-band" fill={band}>CAFÉ &amp; BAR</text>
    </svg>
  );
}
