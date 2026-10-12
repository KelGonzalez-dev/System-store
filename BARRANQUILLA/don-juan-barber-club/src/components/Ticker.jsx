import { useEffect, useRef } from 'react';
import { reducedMotion } from '../lib/scroll';

const WORDS = ['Cortes', 'Barba', 'Skincare', 'Uñas', 'Depilación', 'Facial', 'Bar', 'Shot de bienvenida', 'Atención a domicilio'];

export default function Ticker() {
  const wrap = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const rows = [...wrap.current.querySelectorAll('.tk-track')];
    let off = 0, raf = 0, last = performance.now(), lastY = window.scrollY, vel = 0, visible = false, w = rows[0].scrollWidth / 2;
    const loop = (now) => {
      const dt = Math.min(48, now - last); last = now;
      const y = window.scrollY; vel += (y - lastY - vel) * 0.12; lastY = y;
      off = (off + 0.05 * dt + Math.abs(vel) * 0.4) % w;
      rows[0].style.transform = `translate3d(${-off}px,0,0)`;
      rows[1].style.transform = `translate3d(${off - w}px,0,0)`;
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) { last = performance.now(); lastY = window.scrollY; raf = requestAnimationFrame(loop); } });
    io.observe(wrap.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  const items = [...WORDS, ...WORDS];
  return (
    <div ref={wrap} className="ticker" aria-label={WORDS.join(', ')}>
      {[0, 1].map((r) => (
        <div key={r} className={`tk-row r${r}`}>
          <div className="tk-track" aria-hidden="true">{[0, 1].map((k) => <span key={k} className="flex shrink-0 items-center">{items.map((x, i) => <span key={i} className="tk-word">{x}<i>⚜</i></span>)}</span>)}</div>
        </div>
      ))}
    </div>
  );
}
