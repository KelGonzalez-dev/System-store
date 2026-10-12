import { useEffect, useRef, useState } from 'react';
import { Fleur, NeonLogo } from './Brand';
import { lockScroll, reducedMotion } from '../lib/scroll';

const T = { cut: 3900, split: 4450, done: 5600 };

function Scene() {
  return (
    <div className="ld-scene">
      <div className="ld-bricks" />
      <div className="ld-lamp" />
      <div className="ld-center">
        <NeonLogo draw />
        <p className="ld-tag"><Fleur /> La barbería de los famosos <Fleur /></p>
      </div>
    </div>
  );
}

/**
 * Loader "El corte":
 * en una pared de ladrillo a oscuras, el tubo de neón dibuja "Don Juan" trazo a trazo, parpadea al encenderse,
 * se prenden las letras de BARBER CLUB una por una y una barra de "afilando la navaja" se llena.
 * Entonces una navaja barbera cruza la pantalla en diagonal dejando una línea de luz,
 * y la imagen se parte en dos mitades que se separan para dejar ver la página.
 */
export default function Loader({ onReveal, onDone }) {
  const [phase, setPhase] = useState('in');
  const boxRef = useRef(null);
  const finish = useRef(() => {});
  useEffect(() => {
    const reduce = reducedMotion();
    const W = window.innerWidth, H = window.innerHeight;
    boxRef.current.style.setProperty('--ang', `${(-Math.atan2(H * 0.28, W) * 180) / Math.PI}deg`);
    boxRef.current.style.setProperty('--len', `${Math.hypot(W, H * 0.28) + 40}px`);
    lockScroll(true);
    let unlocked = false;
    const unlock = () => { if (!unlocked) { unlocked = true; lockScroll(false); } };
    const timers = [];
    let done = false;
    const cut = () => setPhase('cut');
    const split = () => {
      if (done) return;
      done = true;
      setPhase('split');
      unlock();
      onReveal();
      timers.push(setTimeout(onDone, reduce ? 200 : T.done - T.split));
    };
    finish.current = () => { cut(); timers.push(setTimeout(split, 500)); };
    if (reduce) timers.push(setTimeout(split, 600));
    else { timers.push(setTimeout(cut, T.cut)); timers.push(setTimeout(split, T.split)); }
    return () => { timers.forEach(clearTimeout); unlock(); };
  }, [onReveal, onDone]);

  return (
    <div ref={boxRef} className={`dj-loader ph-${phase}`} role="status" aria-label="Don Juan Barber Club">
      <div className="half ha"><Scene /></div>
      <div className="half hb"><Scene /></div>
      <div className="ld-hud" aria-hidden="true">
        <p className="ld-sharp"><span>Afilando la navaja</span><i><em /></i></p>
      </div>
      <div className="cut-track" aria-hidden="true">
        <i className="cut-line" />
        <span className="razor">
          <svg viewBox="0 0 220 60">
            <defs><linearGradient id="blade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fafafa" /><stop offset=".55" stopColor="#c9ced6" /><stop offset="1" stopColor="#7d838c" /></linearGradient></defs>
            <path d="M10 22h120c8 0 14 6 14 14v2H18c-6 0-10-4-10-8z" fill="url(#blade)" />
            <path d="M10 38h134" stroke="#fff" strokeWidth="1.5" opacity=".9" />
            <rect x="140" y="20" width="76" height="16" rx="8" fill="#1b1b1b" stroke="#e8b84a" strokeWidth="1.5" />
            <circle cx="146" cy="28" r="4" fill="#e8b84a" />
          </svg>
          <i className="sparks" />
        </span>
      </div>
      <button type="button" className="ld-skip" onClick={() => finish.current()}>Entrar</button>
    </div>
  );
}
