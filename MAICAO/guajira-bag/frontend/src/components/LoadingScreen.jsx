import { useEffect, useMemo, useState } from 'react';
import LOGO_PATHS from './logoPaths';

const DEFAULT_LINES = ['Tejido a mano en La Guajira', 'Cada mochila, una pieza única', 'Hecho con amor y paciencia'];
const STREAKS = 14;

export default function LoadingScreen({ label = 'Guajira Bags', sub, ms = 5000, lines, leaving }) {
  const [i, setI] = useState(0);
  const phrases = lines && lines.length ? lines : DEFAULT_LINES;

  // Trazos: los grandes (aros y letras) primero, el texto pequeño al final
  const strokes = useMemo(() => LOGO_PATHS.map((d, n) => ({
    d,
    del: (0.45 + (n / LOGO_PATHS.length) * 2.6).toFixed(2),
    dur: n < 6 ? 1.9 : n < 30 ? 1.1 : 0.7,
  })), []);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    const iv = setInterval(() => setI((n) => (n + 1) % phrases.length), Math.max(1300, ms / 3));
    return () => { clearInterval(iv); document.documentElement.style.overflow = ''; };
  }, [ms, phrases.length]);

  return (
    <div className={`ld-root${leaving ? ' ld-leaving' : ''}`} role="status" aria-live="polite" aria-label={label} style={{ '--k': ms / 5000 }}>
      <span className="ld-panel ld-panel--l" aria-hidden="true" />
      <span className="ld-panel ld-panel--r" aria-hidden="true" />
      <div className="ld-content">
        <span className="ld-glow" aria-hidden="true" />
        <div className="ld-stage">
          <div className="ld-streaks" aria-hidden="true">
            {Array.from({ length: STREAKS }, (_, n) => (
              <i key={n} style={{ '--a': `${(360 / STREAKS) * n + (n % 2 ? 6 : 0)}deg`, '--j': (n % 5) }} />
            ))}
          </div>
          <svg className="ld-svg" viewBox="0 0 512 512" aria-hidden="true">
            <defs>
              <linearGradient id="ldgold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#d9b35e" />
                <stop offset="0.5" stopColor="#b8862c" />
                <stop offset="1" stopColor="#8f6a24" />
              </linearGradient>
            </defs>
            {strokes.map((s, n) => (
              <path key={n} className="ld-path" d={s.d} pathLength="1" stroke="url(#ldgold)" style={{ '--del': `${s.del}s`, '--dur': `${s.dur}s` }} />
            ))}
          </svg>
          <span className="ld-disc" aria-hidden="true" />
          <img className="ld-img" src="/images/logo.webp" alt="" width="512" height="512" />
        </div>
        <p className="ld-word">{label}</p>
        <p className="ld-line" key={i}>{phrases[i]}</p>
        <div className="ld-bar" aria-hidden="true"><span /></div>
        {sub && <span className="sr">{sub}</span>}
      </div>
    </div>
  );
}
