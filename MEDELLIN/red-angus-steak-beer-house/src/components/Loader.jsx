import { useEffect, useState } from 'react';
import { Letrero } from './Logo';
import { lockScroll, reducedMotion } from '../lib/scroll';

/** Entrada sobria: el letrero aparece sobre negro, se traza un filete dorado y todo se desvanece. */
export default function Loader({ onReveal, onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    lockScroll(true);
    const r = reducedMotion();
    const t1 = setTimeout(() => { setOut(true); lockScroll(false); onReveal(); }, r ? 300 : 1900);
    const t2 = setTimeout(onDone, r ? 500 : 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); lockScroll(false); };
  }, [onReveal, onDone]);
  return (
    <div className={`ld${out ? ' ld--out' : ''}`} role="status" aria-label="Red Angus Steak & Beer House">
      <div className="ld__in">
        <Letrero />
        <span className="ld__filete" />
        <p>Bogotá · Chía · Desde 2012</p>
      </div>
    </div>
  );
}
