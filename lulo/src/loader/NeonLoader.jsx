import { useEffect, useMemo, useRef, useState } from 'react';
import { useLang } from '../i18n/LangContext';

const DURATION = 5900;
const LEAVE = 1500;

const SHAPES = [
  { d: 'M338 375 V740', at: 1.5 },
  { d: 'M415 560 V650 A82.5 82.5 0 0 0 580 650 V560', at: 2.05 },
  { d: 'M650 405 V910', at: 2.6 },
  { d: 'M913 655 A105 105 0 1 1 703 655 A105 105 0 1 1 913 655', at: 3.15 },
];
const RING = 'M1180 600 A560 560 0 1 1 60 600 A560 560 0 1 1 1180 600';

export default function NeonLoader({ onLeave, onDone }) {
  const { t } = useLang();
  const [phase, setPhase] = useState('play');
  const counter = useRef(null);

  const grid = useMemo(() => {
    const portrait = typeof window !== 'undefined' && window.innerWidth < 768;
    const cols = portrait ? 5 : 9;
    const rows = portrait ? 8 : 6;
    const cx = (cols - 1) / 2;
    const cy = (rows - 1) / 2;
    const maxD = Math.hypot(cx, cy);
    const tiles = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dist = Math.hypot(c - cx, r - cy) / maxD;
        const tone = (r * 7 + c * 13) % 5;
        tiles.push({ key: `${r}-${c}`, lit: 2600 + Math.round(dist * 1900), out: Math.round((1 - dist) * 420 + dist * 60), tone });
      }
    }
    return { cols, rows, tiles };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / DURATION);
      if (counter.current) counter.current.textContent = String(Math.round(p * 100)).padStart(2, '0');
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t1 = setTimeout(() => {
      setPhase('leaving');
      onLeave?.();
    }, DURATION);
    const t2 = setTimeout(() => {
      setPhase('gone');
      root.style.overflow = '';
      onDone?.();
    }, DURATION + LEAVE);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      root.style.overflow = '';
    };
  }, [onLeave, onDone]);

  if (phase === 'gone') return null;

  const tones = ['#7a2410', '#6a1c0a', '#8a2d12', '#5a1608', '#742010'];

  return (
    <div
      className={`ld-root fixed inset-0 z-[100] overflow-hidden bg-night ${phase === 'leaving' ? 'ld-leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Lulo Café Bar"
    >
      <div className="ld-stage absolute inset-0">
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)`, gridTemplateRows: `repeat(${grid.rows}, 1fr)` }}>
          {grid.tiles.map((tile) => (
            <div
              key={tile.key}
              className="ld-tile"
              style={{
                '--lit': `${tile.lit}ms`,
                '--out': `${tile.out}ms`,
                background: `linear-gradient(135deg, ${tones[tile.tone]}, #2a0a03 90%)`,
                boxShadow: 'inset 0 0 0 1px rgba(20,2,0,.85)',
              }}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(20,2,0,0) 0%, rgba(20,2,0,.55) 55%, rgba(20,2,0,.92) 100%)' }} />
      </div>

      <div className="ld-logo absolute inset-0 grid place-items-center">
        <div className="ld-burst relative aspect-square w-[min(78vw,52svh,460px)]">
          <svg viewBox="0 0 1254 1254" className="h-full w-full overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <filter id="ldBlur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="26" />
              </filter>
            </defs>
            <g filter="url(#ldBlur)">
              <path className="ld-ring" pathLength="1" d={RING} stroke="#ff7a2f" strokeWidth="70" opacity=".6" />
              {SHAPES.map((s) => (
                <path key={s.d} className="ld-stroke" pathLength="1" d={s.d} stroke="#ff7a2f" strokeWidth="76" opacity=".75" style={{ '--at': `${s.at}s` }} />
              ))}
            </g>
            <path className="ld-ring" pathLength="1" d={RING} stroke="#fcfaef" strokeWidth="22" />
            {SHAPES.map((s) => (
              <path key={`c${s.d}`} className="ld-stroke" pathLength="1" d={s.d} stroke="#fcfaef" strokeWidth="28" style={{ '--at': `${s.at}s` }} />
            ))}
          </svg>
        </div>
      </div>

      <div className="ld-ui pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-5 px-6 pb-10 sm:pb-14">
        <div className="relative h-6 w-full max-w-xs text-center font-display text-[12px] font-light uppercase tracking-[.42em] text-neon/80">
          {t.loader.lines.map((line, i) => (
            <span key={line} className="ld-line" style={{ '--l': `${0.4 + i * 1.7}s` }}>{line}</span>
          ))}
          <span className="ld-welcome absolute inset-0 flex items-center justify-center neon-text">{t.loader.welcome}</span>
        </div>
        <div className="flex items-baseline gap-2 font-display font-extralight text-neon/70">
          <span ref={counter} className="text-4xl tabular-nums tracking-widest">00</span>
          <span className="text-sm tracking-[.3em]">/ 100</span>
        </div>
      </div>
    </div>
  );
}
