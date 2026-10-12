import { useEffect, useRef, useState } from 'react';
import { Mark } from './Brand';
import { useI18n } from '../i18n';
import { lockScroll, reducedMotion } from '../lib/scroll';

const T = { exit: 4700, exitLen: 1400 };
const WORD = 'CAFETOMÁS';

/**
 * Loader "Extracción perfecta":
 * una taza vista desde arriba sobre el plato; el espresso la llena y se forma la crema,
 * la leche dibuja una rosetta de latte art que se transforma en el símbolo de Cafetomás.
 * El anillo "MAESTRÍA EN CAFÉ" gira alrededor, y el temporizador de barista marca 25 s
 * mientras la báscula sube de 18 g a 36 g. Al final, dos olas (amarilla y morada) suben y revelan la página.
 */
export default function Loader({ onReveal, onDone }) {
  const { t } = useI18n();
  const [phase, setPhase] = useState('in');
  const timeRef = useRef(null);
  const gramsRef = useRef(null);
  const barRef = useRef(null);
  const finish = useRef(() => {});

  useEffect(() => {
    const reduce = reducedMotion();
    lockScroll(true);
    let unlocked = false;
    const unlock = () => { if (!unlocked) { unlocked = true; lockScroll(false); } };
    const timers = [];
    const t0 = performance.now();
    let raf = 0;
    const tick = (now) => {
      const p = Math.min(1, (now - t0 - 500) / 3600);
      const k = Math.max(0, p);
      const sec = Math.round(k * 25);
      if (timeRef.current) timeRef.current.textContent = `00:${String(sec).padStart(2, '0')}`;
      if (gramsRef.current) gramsRef.current.textContent = `${(18 + k * 18).toFixed(1)} g`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${k})`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setPhase('exit');
      // cuando las olas cubren la pantalla, la página ya está lista detrás
      timers.push(setTimeout(() => { unlock(); onReveal(); setPhase('reveal'); }, reduce ? 0 : 700));
      timers.push(setTimeout(onDone, reduce ? 200 : T.exitLen + 100));
    };
    finish.current = go;
    timers.push(setTimeout(go, reduce ? 700 : T.exit));
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); unlock(); };
  }, [onReveal, onDone]);

  const ring = t.loader.ring;
  // tulipán de latte art: tres corazones apilados
  const heart = (y, w, h) => `M0 ${y + h}C${-w * 1.15} ${y + h * 0.3} ${-w * 0.6} ${y - h * 0.42} 0 ${y + h * 0.1}C${w * 0.6} ${y - h * 0.42} ${w * 1.15} ${y + h * 0.3} 0 ${y + h}Z`;
  const tulip = [heart(4, 50, 52), heart(-30, 38, 40), heart(-56, 26, 28)].join('');
  return (
    <div className={`ct-loader ph-${phase}`} role="status" aria-label="Cafetomás">
      <div className="ld-bg" aria-hidden="true" />
      <div className="ld-center">
        <div className="cup-scene" aria-hidden="true">
          <svg viewBox="-160 -160 320 320" className="cup-svg">
            <defs>
              <path id="ringPath" d="M0 -138a138 138 0 1 1 -0.1 0" />
              <radialGradient id="espresso" cx="45%" cy="40%" r="60%"><stop offset="0" stopColor="#6b3a1e" /><stop offset=".55" stopColor="#3b1d0f" /><stop offset="1" stopColor="#1e0e07" /></radialGradient>
              <radialGradient id="crema" cx="50%" cy="50%" r="50%"><stop offset=".55" stopColor="#c98a4a" stopOpacity="0" /><stop offset=".85" stopColor="#c98a4a" /><stop offset="1" stopColor="#8a5428" /></radialGradient>
            </defs>
            <g className="ring-rot"><text className="ring-text"><textPath href="#ringPath" textLength="852" lengthAdjust="spacing">{ring}</textPath></text></g>
            <circle r="122" className="saucer" />
            <circle r="104" className="saucer-in" />
            <rect x="82" y="-16" width="62" height="32" rx="16" className="handle" />
            <circle r="92" className="cup-rim" />
            <circle r="80" className="cup-in" />
            <g className="coffee"><circle r="80" fill="url(#espresso)" /><circle r="80" fill="url(#crema)" /></g>
            <g className="art">
              <path className="rosetta" d={tulip} />
              <path className="ripple" d="M-40 40c20 12 60 12 80 0M-30 -2c16 9 44 9 60 0M-20 -32c10 6 30 6 40 0" />
              <path className="pull" d="M0-60V60" />
            </g>
          </svg>
          <div className="art-mark"><Mark /></div>
          <span className="steam s1" /><span className="steam s2" /><span className="steam s3" />
        </div>
        <p className="ld-word" aria-label={WORD}>{WORD.split('').map((c, i) => <span key={i} style={{ '--i': i }} aria-hidden="true">{c}</span>)}</p>
        <p className="ld-tag">{t.loader.tag}</p>
        <div className="ld-scale" aria-hidden="true">
          <div><span>{t.loader.extraction}</span><b ref={timeRef}>00:00</b></div>
          <i className="ld-bar"><em ref={barRef} /></i>
          <div><span>{t.loader.dose} 18 g → {t.loader.yield}</span><b ref={gramsRef}>18.0 g</b></div>
        </div>
      </div>
      <div className="wave w1" aria-hidden="true" />
      <div className="wave w2" aria-hidden="true" />
      <button type="button" className="ld-skip" onClick={() => finish.current()}>{t.loader.skip}</button>
    </div>
  );
}
