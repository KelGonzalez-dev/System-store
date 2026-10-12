import { useEffect, useRef, useState } from 'react';
import { CVLogo } from './Brand';
import { useI18n } from '../i18n';
import { lockScroll, reducedMotion } from '../lib/scroll';

const T = { open: 4400, openLen: 1700 };

// Una hoja de la puerta colonial azul (tableros, vetas y aldaba)
function Leaf({ side }) {
  return (
    <div className={`door door-${side}`}>
      <div className="door-face">
        <div className="door-panel p1" /><div className="door-panel p2" /><div className="door-panel p3" />
        <span className="door-studs" />
        <svg className="knocker" viewBox="0 0 60 90" aria-hidden="true">
          <circle cx="30" cy="14" r="8" fill="url(#brass)" />
          <path d="M30 22c-17 0-24 14-24 28s9 30 24 30 24-16 24-30-7-28-24-28zm0 8c11 0 16 10 16 20s-6 22-16 22-16-12-16-22 5-20 16-20z" fill="url(#brass)" />
        </svg>
      </div>
      <div className="door-back" />
    </div>
  );
}

/**
 * Loader "Bienvenidos a casa":
 * la puerta azul de la casa colonial, cerrada y con luz cálida colándose por la rendija;
 * el sello de Casa Vieja se dibuja sobre ella, sube el vapor de un café recién hecho,
 * se escribe "Bienvenidos a casa", tocan la puerta (toc, toc) y las dos hojas se abren en 3D
 * dejando entrar la luz y revelando la página.
 */
export default function Loader({ onReveal, onDone }) {
  const { t } = useI18n();
  const [phase, setPhase] = useState('closed');
  const pctRef = useRef(null);
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
      const p = Math.min(1, (now - t0) / (reduce ? 1 : T.open - 300));
      if (pctRef.current) pctRef.current.style.transform = `scaleY(${p})`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      unlock();
      onReveal();
      // se espera un par de cuadros para que la página quede pintada detrás antes de abrir la puerta
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setPhase('open');
        timers.push(setTimeout(onDone, reduce ? 200 : T.openLen + 250));
      }));
    };
    finish.current = go;
    if (!reduce) timers.push(setTimeout(() => setPhase('knock'), T.open - 900));
    timers.push(setTimeout(go, reduce ? 700 : T.open));
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); unlock(); };
  }, [onReveal, onDone]);

  const words = t.loader.welcome;
  return (
    <div className={`cv-loader ph-${phase}`} role="status" aria-label="Casa Vieja">
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f3d27a" /><stop offset=".5" stopColor="#b8862b" /><stop offset="1" stopColor="#6e4b14" /></linearGradient>
        </defs>
      </svg>
      <div className="scene">
        <div className="floor" aria-hidden="true" />
        <div className="wall-glow" aria-hidden="true" />
        <div className="portal" aria-hidden="true">
          <i className="wall w-t" /><i className="wall w-b" /><i className="wall w-l" /><i className="wall w-r" />
          <div className="doors">
            <Leaf side="l" />
            <Leaf side="r" />
            <i className="seam" />
          </div>
          <div className="lamp"><i /></div>
        </div>
        <div className="ld-center">
          <div className="chain" aria-hidden="true" />
          <div className="ld-seal">
            <span className="steam s1" /><span className="steam s2" /><span className="steam s3" />
            <CVLogo />
          </div>
          <p className="ld-welcome font-hand" aria-label={words}>
            {words.split('').map((c, i) => <span key={i} style={{ '--i': i }} aria-hidden="true">{c === ' ' ? '\u00A0' : c}</span>)}
          </p>
          <div className="ld-brew">
            <span className="cup" aria-hidden="true"><i ref={pctRef} /></span>
            {t.loader.brewing}
          </div>
        </div>
      </div>
      <div className="ld-light" aria-hidden="true" />
      <button type="button" className="ld-skip" onClick={() => finish.current()}>{t.loader.skip}</button>
    </div>
  );
}
