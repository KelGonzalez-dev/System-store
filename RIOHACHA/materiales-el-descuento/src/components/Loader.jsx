import { useEffect, useRef, useState } from 'react';
import { MDLogo } from './Brand';
import { lockScroll, reducedMotion } from '../lib/scroll';

/**
 * Loader "Levantando la obra": los bloques caen y se pegan hilada por hilada hasta formar un muro;
 * en el centro se estampa el logo MD y "Tu aliado para la construcción". Al final el muro se desarma:
 * cada bloque cae girando y aparece la página.
 */
export default function Loader({ onReveal, onDone }) {
  const [phase, setPhase] = useState('in');
  const [grid, setGrid] = useState({ cols: 10, rows: 8 });
  const finish = useRef(() => {});
  useEffect(() => {
    const W = window.innerWidth, H = window.innerHeight;
    const bw = W < 700 ? 90 : 140;
    setGrid({ cols: Math.ceil(W / bw) + 1, rows: Math.ceil(H / (bw * 0.45)) });
    const reduce = reducedMotion();
    lockScroll(true);
    let unlocked = false;
    const unlock = () => { if (!unlocked) { unlocked = true; lockScroll(false); } };
    const timers = [];
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      setPhase('out');
      unlock();
      onReveal();
      timers.push(setTimeout(onDone, reduce ? 150 : 1500));
    };
    finish.current = go;
    timers.push(setTimeout(go, reduce ? 500 : 3600));
    return () => { timers.forEach(clearTimeout); unlock(); };
  }, [onReveal, onDone]);
  const bricks = [];
  for (let r = 0; r < grid.rows; r++) for (let c = 0; c < grid.cols; c++) bricks.push({ r, c, s: (r * 7 + c * 13) % 9 });
  return (
    <div className={`md-loader ph-${phase}`} role="status" aria-label="Materiales El Descuento">
      <div className="wall" style={{ '--cols': grid.cols, '--rows': grid.rows }}>
        {bricks.map((b) => (
          <i key={`${b.r}-${b.c}`} className="brk" style={{ '--r': grid.rows - 1 - b.r, '--c': b.c, '--s': b.s, '--odd': b.r % 2 }} />
        ))}
      </div>
      <div className="ld-card">
        <div className="ld-logo"><MDLogo /></div>
        <p className="ld-name">MATERIALES EL DESCUENTO</p>
        <p className="ld-tag">Tu aliado para la construcción</p>
        <div className="ld-bar"><i /></div>
      </div>
      <button type="button" className="ld-skip" onClick={() => finish.current()}>Entrar</button>
    </div>
  );
}
