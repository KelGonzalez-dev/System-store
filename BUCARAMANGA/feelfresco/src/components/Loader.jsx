import { useEffect, useRef, useState } from 'react';
import { Badge } from './Mascot';
import Palm from './Palm';
import { useI18n } from '../i18n';
import { lockScroll, reducedMotion } from '../lib/scroll';

const T = { load: 3900, exit: 4600, exitLen: 1150 };
const WORD = 'Feel Fresco';

// Loader: sol que gira, palmeras que se mecen y la mascota chiflando con notas musicales
export default function Loader({ onReveal, onDone }) {
  const { t } = useI18n();
  const pct = useRef(null);
  const bar = useRef(null);
  const [exit, setExit] = useState(false);
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
      const p = Math.min(1, (now - t0) / (reduce ? 1 : T.load));
      const e = 1 - Math.pow(1 - p, 2);
      if (pct.current) pct.current.textContent = `${Math.round(e * 100)}%`;
      if (bar.current) bar.current.style.transform = `scaleX(${e})`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setExit(true);
      unlock();
      onReveal();
      timers.push(setTimeout(onDone, reduce ? 200 : T.exitLen + 60));
    };
    finish.current = go;
    timers.push(setTimeout(go, reduce ? 700 : T.exit));
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); unlock(); };
  }, [onReveal, onDone]);

  return (
    <div className={`ff-loader ${exit ? 'is-exit' : ''}`} role="status" aria-label="Feel Fresco">
      <div className="ld-sun" aria-hidden="true" />
      <Palm className="ld-palm p-tl" />
      <Palm className="ld-palm p-br" />
      <div className="ld-center">
        <div className="ld-badge"><Badge className="w-full" /></div>
        <p className="ld-word font-display" aria-hidden="true">
          {WORD.split('').map((c, i) => <span key={i} style={{ '--i': i }}>{c === ' ' ? '\u00A0' : c}</span>)}
        </p>
        <p className="ld-tag font-script">{t.loader.tag}</p>
        <div className="ld-progress" aria-hidden="true">
          <div className="ld-track"><i ref={bar} /></div>
          <span ref={pct} className="font-display">0%</span>
        </div>
      </div>
      <svg className="ld-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0h1440v40c-120 40-240 60-360 40S840 20 720 40 480 100 360 90 120 40 0 60z" />
      </svg>
      <button type="button" className="ld-skip" onClick={() => finish.current()}>{t.loader.skip}</button>
    </div>
  );
}
