import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { reducedMotion } from '../lib/scroll';

// Cinta amarilla tipo sticker que corre sola y se acelera con el scroll
export default function Tape() {
  const { t, lang } = useI18n();
  const wrap = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const tr = wrap.current.querySelector('.tape-track');
    let w = tr.scrollWidth / 2, off = 0, raf = 0, last = performance.now(), lastY = window.scrollY, vel = 0, visible = false;
    const loop = (now) => {
      const dt = Math.min(48, now - last); last = now;
      const y = window.scrollY; vel += (y - lastY - vel) * 0.12; lastY = y;
      off = (off + 0.07 * dt + Math.abs(vel) * 0.4) % w;
      tr.style.transform = `translate3d(${-off}px,0,0)`;
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting; cancelAnimationFrame(raf);
      if (visible) { last = performance.now(); lastY = window.scrollY; raf = requestAnimationFrame(loop); }
    });
    io.observe(wrap.current);
    const onR = () => { w = tr.scrollWidth / 2; };
    window.addEventListener('resize', onR);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('resize', onR); };
  }, [lang]);
  const items = [...t.tape, ...t.tape];
  return (
    <div ref={wrap} className="tape" aria-label={t.tape.join(', ')}>
      <div className="tape-band" aria-hidden="true">
        <div className="tape-track">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 items-center">
              {items.map((w, i) => <span key={i} className="tape-word font-display">{w}<i>{i % 2 ? '🌴' : '🍔'}</i></span>)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
