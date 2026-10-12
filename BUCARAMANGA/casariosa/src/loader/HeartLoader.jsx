import { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n/LangContext';

const DURATION = 5700;
const HEART = 'M100,80 C100,42 52,24 28,54 C2,88 30,132 100,178 C170,132 198,88 172,54 C148,24 100,42 100,80 Z';

export default function HeartLoader({ onLeave, onDone }) {
  const { t } = useLang();
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const pct = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / DURATION);
      if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(2, '0');
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t1 = setTimeout(() => { setLeaving(true); onLeave?.(); }, DURATION);
    const t2 = setTimeout(() => { root.style.overflow = ''; setGone(true); onDone?.(); }, DURATION + 820);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      root.style.overflow = '';
    };
  }, [onLeave, onDone]);

  if (gone) return null;

  return (
    <div
      className={`ld-root fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-night px-6 ${leaving ? 'ld-leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Casa Riosa"
    >
      <div className="ld-pulse pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-wine/30 blur-3xl" />
      <div className="ld-pulse pointer-events-none absolute -right-16 bottom-1/4 h-72 w-72 rounded-full bg-gold/20 blur-3xl" style={{ animationDelay: '1.3s' }} />

      <div className="relative" style={{ width: 'min(50vw, 28svh, 230px)' }}>
        <svg viewBox="0 0 200 200" className="w-full overflow-visible">
          <path d={HEART} fill="none" stroke="#3a1c16" strokeWidth="7" opacity=".4" />
          <path className="ld-heart play" pathLength="1" d={HEART} fill="none" stroke="#c6a15b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ld-heart-glow play" d={HEART} fill="#8c1d22" opacity="0" />
        </svg>
        <div className="ld-heart-glow play absolute inset-0 grid place-items-center" style={{ animationDelay: '2.1s' }}>
          <img src="/logo-badge.png" alt="" className="h-[46%] w-[46%] rounded-full" style={{ boxShadow: '0 0 40px rgba(198,161,91,.5)' }} />
        </div>
      </div>

      <p className="ld-word play script mt-5 text-5xl text-cream" style={{ '--at': '2.5s' }}>Casa Riosa</p>
      <p className="ld-word play eyebrow mt-2" style={{ '--at': '2.85s' }}>La Cucina Dell'amore</p>

      <div className="relative mt-8 h-6 w-full max-w-xs text-center font-display text-[11px] font-bold uppercase tracking-[.36em] text-cream/70">
        {t.loader.lines.map((line, i) => (
          <span key={line} className="ld-line" style={{ '--l': `${3.1 + i * 0.85}s` }}>{line}</span>
        ))}
      </div>
      <div className="mt-3 flex items-baseline gap-2 font-display text-gold/80">
        <span ref={pct} className="text-2xl font-bold tabular-nums tracking-widest">00</span>
        <span className="text-xs tracking-[.3em]">%</span>
      </div>
    </div>
  );
}
