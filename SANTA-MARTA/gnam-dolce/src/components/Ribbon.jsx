import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { reducedMotion } from '../lib/scroll';

// Cinta en cursiva, alternada con la marca, que se acelera con el scroll
export default function Ribbon() {
  const { t, lang } = useI18n();
  const wrap = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const tr = wrap.current.querySelector('.rb-track');
    let w = tr.scrollWidth / 2, off = 0, raf = 0, last = performance.now(), lastY = window.scrollY, vel = 0, visible = false;
    const loop = (now) => {
      const dt = Math.min(48, now - last); last = now;
      const y = window.scrollY; vel += (y - lastY - vel) * 0.12; lastY = y;
      off = (off + 0.04 * dt + Math.abs(vel) * 0.3) % w;
      tr.style.transform = `translate3d(${-off}px,0,0)`;
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) { last = performance.now(); lastY = window.scrollY; raf = requestAnimationFrame(loop); } });
    io.observe(wrap.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [lang]);
  const items = [...t.ribbon, ...t.ribbon];
  return (
    <div ref={wrap} className="ribbon" aria-label={t.ribbon.join(', ')}>
      <div className="rb-track" aria-hidden="true">
        {[0, 1].map((k) => <span key={k} className="flex shrink-0 items-center">{items.map((x, i) => <span key={i} className="rb-word">{x}<i>✦</i></span>)}</span>)}
      </div>
    </div>
  );
}
