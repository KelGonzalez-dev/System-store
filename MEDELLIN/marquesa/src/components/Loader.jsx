import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { lockScroll, reducedMotion } from '../lib/scroll';

// Línea de tiempo (ms)
const T = { count: 2300, burgerOut: 2450, sign: 2600, exit: 5400, exitLen: 1050 };
const NAME = 'MARQUESA';
// Globos rosa y negro (posición, retraso, tamaño, color)
const BALLOONS = [
  [6, 0, 1, 'p'], [16, 0.5, 0.8, 'b'], [27, 0.2, 1.1, 'p'], [38, 0.8, 0.75, 'b'], [50, 0.35, 0.95, 'p'],
  [61, 0.65, 1.15, 'b'], [72, 0.1, 0.85, 'p'], [83, 0.55, 1, 'b'], [93, 0.25, 0.9, 'p'], [44, 1.1, 0.7, 'p'],
];

function Burger() {
  return (
    <svg viewBox="0 0 240 210" className="h-full w-full overflow-visible" aria-hidden="true">
      {/* pan de abajo */}
      <g className="bl" style={{ '--d': '0.15s' }}>
        <path d="M36 168h168c0 18-14 30-32 30H68c-18 0-32-12-32-30z" fill="#F6A9D4" stroke="#FF4FA3" strokeWidth="3" />
      </g>
      {/* carne */}
      <g className="bl" style={{ '--d': '0.42s' }}>
        <rect x="30" y="134" width="180" height="32" rx="16" fill="#3B2320" stroke="#140c0b" strokeWidth="3" />
        <path d="M58 146l10 8M92 144l10 8M126 144l10 8M160 146l10 8" stroke="#6b3d33" strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* queso */}
      <g className="bl" style={{ '--d': '0.68s' }}>
        <path d="M26 122h188l-10 14-12-2-8 18-10-16-30 2-8 14-8-14-36 0-10 20-10-20-26-2-10 12z" fill="#FFC93C" stroke="#E7A300" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      {/* lechuga */}
      <g className="bl" style={{ '--d': '0.92s' }}>
        <path d="M22 116c10-12 18 6 28-4s18 8 28-2 18 8 28-2 18 8 28-2 18 8 28-2 18 8 28-2 16 6 28 4l-6 12H28z" fill="#8FE07A" stroke="#3FA34D" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      {/* pan de arriba */}
      <g className="bl" style={{ '--d': '1.18s' }}>
        <path d="M32 110c0-54 40-84 88-84s88 30 88 84z" fill="#F6A9D4" stroke="#FF4FA3" strokeWidth="3" />
        <g fill="#FFF3FA">
          <ellipse cx="86" cy="58" rx="5" ry="3" transform="rotate(-20 86 58)" /><ellipse cx="120" cy="46" rx="5" ry="3" />
          <ellipse cx="154" cy="58" rx="5" ry="3" transform="rotate(20 154 58)" /><ellipse cx="102" cy="80" rx="5" ry="3" transform="rotate(10 102 80)" />
          <ellipse cx="140" cy="82" rx="5" ry="3" transform="rotate(-12 140 82)" /><ellipse cx="68" cy="88" rx="5" ry="3" transform="rotate(-30 68 88)" />
          <ellipse cx="172" cy="88" rx="5" ry="3" transform="rotate(30 172 88)" />
        </g>
      </g>
    </svg>
  );
}

export default function Loader({ onReveal, onDone }) {
  const { t } = useI18n();
  const count = useRef(null);
  const [phase, setPhase] = useState('build'); // build → sign → exit
  const finish = useRef(() => {});

  useEffect(() => {
    const reduce = reducedMotion();
    lockScroll(true);
    let unlocked = false;
    const unlock = () => { if (!unlocked) { unlocked = true; lockScroll(false); } };
    const timers = [];

    // Contador 0 → 100 % sin re-renderizar React
    const t0 = performance.now();
    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / (reduce ? 1 : T.count));
      const e = 1 - Math.pow(1 - p, 2.2);
      if (count.current) count.current.textContent = String(Math.round(e * 100)).padStart(3, '0');
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    timers.push(setTimeout(() => setPhase('sign'), reduce ? 50 : T.sign));
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setPhase('exit');
      unlock();
      onReveal();
      timers.push(setTimeout(onDone, reduce ? 250 : T.exitLen + 60));
    };
    finish.current = go;
    timers.push(setTimeout(go, reduce ? 900 : T.exit));
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); unlock(); };
  }, [onReveal, onDone]);

  return (
    <div className={`mq-loader ph-${phase}`} role="status" aria-label="The Marquesa">
      <div className="ld-glow" aria-hidden="true" />
      <div className="ld-checker" aria-hidden="true" />

      <div className="ld-build">
        <div className="ld-burger"><Burger /></div>
        <p className="ld-count font-display"><span ref={count}>000</span><small>%</small></p>
        <p className="ld-fire">{t.loader.fire}<i>.</i><i>.</i><i>.</i></p>
      </div>

      <div className="ld-sign" aria-hidden="true">
        <p className="ld-the font-display">The</p>
        <p className="ld-name font-display">
          {NAME.split('').map((c, i) => <span key={i} style={{ '--d': `${[0.05, 0.32, 0.12, 0.5, 0.2, 0.42, 0.08, 0.6][i]}s` }}>{c}</span>)}
        </p>
        <svg viewBox="0 0 640 120" className="ld-script">
          <text x="50%" y="78" textAnchor="middle">De la Marquesa con Amor</text>
        </svg>
      </div>

      <div className="ld-balloons" aria-hidden="true">
        {BALLOONS.map(([x, d, s, c], i) => (
          <i key={i} className={`balloon ${c === 'p' ? 'is-pink' : 'is-black'}`} style={{ '--x': `${x}%`, '--d': `${d}s`, '--s': s }} />
        ))}
      </div>

      <button type="button" className="ld-skip" onClick={() => finish.current()}>{t.loader.skip}</button>
    </div>
  );
}
