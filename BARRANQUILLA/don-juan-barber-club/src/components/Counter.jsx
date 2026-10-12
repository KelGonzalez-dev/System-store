import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from '../lib/scroll';

// Número que cuenta desde 0 cuando aparece en pantalla
export default function Counter({ n, s = '', dur = 1600 }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (reducedMotion()) { setV(n); return undefined; }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now) => { const k = Math.min(1, (now - t0) / dur); setV(Math.round(n * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [n, dur]);
  return <span ref={ref}>{v}{s}</span>;
}
