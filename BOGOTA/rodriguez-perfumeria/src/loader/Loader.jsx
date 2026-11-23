import { useEffect, useRef, useState } from 'react';
import { LOGO } from '../data/content';

const MIN = 2900;
const MAX = 6500;
const LEAVE = 1300;

export default function Loader({ onLeave }) {
  const [phase, setPhase] = useState('play');
  const num = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const min = reduce ? 500 : MIN;
    const t0 = performance.now();
    let raf = 0;
    let dead = false;
    let loaded = false;
    let left = false;

    const logo = new Image();
    logo.src = LOGO;
    const assets = Promise.all([
      logo.decode ? logo.decode().catch(() => {}) : Promise.resolve(),
      document.fonts && document.fonts.ready ? document.fonts.ready.catch(() => {}) : Promise.resolve(),
    ]);
    assets.then(() => { loaded = true; });

    const tick = (now) => {
      if (dead) return;
      const t = now - t0;
      const ready = (loaded && t >= min) || t >= MAX;
      const p = ready ? 100 : Math.min(99, Math.round((t / min) * 100));
      if (num.current) num.current.textContent = String(p).padStart(3, '0');
      if (ready && !left) {
        left = true;
        setPhase('leaving');
        onLeave?.();
        setTimeout(() => { if (!dead) setPhase('gone'); }, LEAVE);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      root.style.overflow = '';
    };
  }, [onLeave]);

  if (phase === 'gone') return null;

  return (
    <div className={`ld-root ${phase === 'leaving' ? 'ld-leaving' : ''}`} role="status" aria-live="polite" aria-label="Rodriguez Perfumería">
      <div className="ld-shutter ld-top" />
      <div className="ld-shutter ld-bot" />
      <div className="ld-glow" />

      <div className="ld-stage">
        <div className="ld-mark">
          <img src={LOGO} alt="" className="ld-ghost" draggable="false" />
          <div className="ld-fill">
            <img src={LOGO} alt="" draggable="false" />
          </div>
          <div className="ld-level" />
        </div>
        <p className="ld-tag">Perfumería de autor</p>
      </div>

      <div className="ld-count">
        <span ref={num} className="ld-num">000</span>
        <span className="mb-1 font-cond text-[13px] font-semibold uppercase tracking-[.4em] text-ivory/50">Destilando</span>
      </div>
      <span className="ld-bar" />
    </div>
  );
}
