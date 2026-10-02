import { useCallback, useEffect, useRef, useState } from 'react';
import { FACTS } from '../data/content';

const WAVE = 'M4 12 C 20 2, 36 22, 52 12 S 84 2, 100 12 S 132 22, 148 12 S 180 2, 196 12';
const SEG = 2.1; // segundos por tramo (café → cacao → caña). Sube este número para más tiempo de lectura.
const TOTAL = SEG * 3 * 1000 + 400; // ms hasta abrir la página

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function Loader({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const [facts] = useState(() => FACTS.map((f) => pick(f.items)));
  const pct = useRef(null);
  const left = useRef(false);

  const leave = useCallback(() => {
    if (left.current) return;
    left.current = true;
    setLeaving(true);
    onDone?.();
    setTimeout(() => {
      document.documentElement.style.overflow = '';
      setGone(true);
    }, 950);
  }, [onDone]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const timer = setTimeout(leave, TOTAL);
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / (SEG * 3000));
      if (pct.current) pct.current.textContent = `${Math.round(p * 100)}%`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      if (!left.current) root.style.overflow = '';
    };
  }, [leave]);

  if (gone) return null;

  return (
    <div
      className={`ld-root fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-cream px-5 ${leaving ? 'leaving' : ''}`}
      role="status"
      aria-label="Cargando Tres Raíces"
    >
      <div className="ld-glow pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-lime/25 blur-3xl" />
      <div className="ld-glow pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-gold-light/30 blur-3xl" style={{ animationDelay: '1.2s' }} />

      {/* Logo que se "llena" de color de abajo hacia arriba */}
      <div className="relative" style={{ width: 'min(44vw, 22svh, 220px)' }}>
        <img src="/logo.webp" alt="" className="w-full select-none opacity-[.16] grayscale" draggable="false" />
        <img src="/logo.webp" alt="Tres Raíces" className="ld-fill absolute inset-0 w-full select-none" style={{ animationDuration: `${SEG * 3}s` }} draggable="false" />
      </div>

      <p className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">Tres Raíces</p>

      {/* Tres raíces onduladas que se dibujan una tras otra */}
      <div className="mt-5 w-full max-w-md">
        <div className="grid grid-cols-3 gap-3">
          {FACTS.map((c, i) => (
            <div key={c.key}>
              <div className="relative">
                <svg viewBox="0 0 200 24" className="h-6 w-full" fill="none" aria-hidden="true">
                  <path d={WAVE} stroke={c.color} strokeOpacity=".18" strokeWidth="5" strokeLinecap="round" />
                  <path d={WAVE} pathLength="1" stroke={c.color} strokeWidth="5" className="ld-wave" style={{ animationDelay: `${i * SEG}s`, animationDuration: `${SEG}s` }} />
                </svg>
                <span
                  className="ld-dot absolute right-0 top-1/2 h-3.5 w-3.5 rounded-full ring-2 ring-cream"
                  style={{ background: c.color, animationDelay: `${(i + 1) * SEG - 0.1}s` }}
                />
              </div>
              <p className="ld-lab mt-1 text-center text-xs font-semibold text-ink" style={{ animationDelay: `${(i + 1) * SEG - 0.1}s` }}>
                {c.label}
              </p>
            </div>
          ))}
        </div>
        <p ref={pct} className="mt-2 text-center font-display text-sm font-semibold tabular-nums text-leaf">0%</p>
      </div>

      {/* Los tres datos van apareciendo y se quedan en pantalla para poder leerlos */}
      <div className="mt-4 w-full max-w-md space-y-2.5">
        {FACTS.map((c, i) => (
          <div
            key={c.key}
            className="ld-fact flex items-start gap-3 rounded-2xl border border-ink/10 bg-white/75 px-4 py-3 shadow-sm"
            style={{ animationDelay: `${0.3 + i * SEG}s`, borderLeft: `5px solid ${c.color}` }}
          >
            <p className="text-[14px] leading-snug text-ink/90 sm:text-[15px]">
              <span className="mr-1.5 font-bold" style={{ color: c.key === 'cana' ? '#2b661b' : c.key === 'cacao' ? '#8e4201' : '#c90e1e' }}>{c.label}:</span>
              {facts[i]}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={leave}
        className="absolute bottom-4 right-5 rounded-full px-3 py-2 text-xs font-semibold text-ink/60 underline underline-offset-4 hover:text-ink"
      >
        Saltar
      </button>
    </div>
  );
}
