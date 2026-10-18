import { useEffect, useRef, useState } from 'react';
import { Logo } from './Brand';
import { lockScroll, reducedMotion } from '../lib/scroll';

/**
 * Loader "La pared de madera":
 * la recepción de Jean Paul a oscuras: listones de madera verticales. Las luces LED entre listones se encienden
 * de izquierda a derecha, el nombre se escribe en pan de oro con un brillo que lo recorre, aparece BARBERÍA VIP
 * y el lema. Al final, los listones giran como persianas, desde el centro hacia afuera, y dejan ver la página.
 */
export default function Loader({ onReveal, onDone }) {
  const [phase, setPhase] = useState('in');
  const [n, setN] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 700 ? 8 : 14));
  const finish = useRef(() => {});
  useEffect(() => {
    const reduce = reducedMotion();
    setN(window.innerWidth < 700 ? 8 : 14);
    lockScroll(true);
    let unlocked = false;
    const unlock = () => { if (!unlocked) { unlocked = true; lockScroll(false); } };
    const timers = [];
    let done = false;
    const open = () => {
      if (done) return;
      done = true;
      setPhase('open');
      unlock();
      onReveal();
      timers.push(setTimeout(onDone, reduce ? 200 : 1500));
    };
    finish.current = open;
    timers.push(setTimeout(open, reduce ? 600 : 4300));
    return () => { timers.forEach(clearTimeout); unlock(); };
  }, [onReveal, onDone]);
  const mid = (n - 1) / 2;
  return (
    <div className={`jp-loader ph-${phase}`} role="status" aria-label="Jean Paul Barbería VIP">
      <div className="slats" style={{ '--n': n }}>
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="slat" style={{ '--i': i, '--o': Math.abs(i - mid) }}>
            <span className="slat-wood" /><span className="slat-led" />
          </div>
        ))}
      </div>
      <div className="ld-glow" aria-hidden="true" />
      <div className="ld-center">
        <Logo />
        <p className="ld-motto">Elegancia para grandes, cariño para pequeños</p>
        <div className="ld-bar" aria-hidden="true"><i /></div>
      </div>
      <button type="button" className="ld-skip" onClick={() => finish.current()}>Entrar</button>
    </div>
  );
}
