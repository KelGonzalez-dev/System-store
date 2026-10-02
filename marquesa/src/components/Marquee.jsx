import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { reducedMotion } from '../lib/scroll';

// Dos cintas cruzadas que corren solas y se aceleran con la velocidad del scroll
export default function Marquee() {
  const { t, lang } = useI18n();
  const wrap = useRef(null);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const tracks = [...wrap.current.querySelectorAll('.mq-track')];
    let widths = tracks.map((tr) => tr.scrollWidth / 2);
    const off = [0, 0];
    let raf = 0, last = performance.now(), lastY = window.scrollY, vel = 0, visible = false;
    const loop = (now) => {
      const dt = Math.min(48, now - last); last = now;
      const y = window.scrollY; const dy = y - lastY; lastY = y;
      vel += (dy - vel) * 0.12;
      const speed = 0.06 * dt + Math.abs(vel) * 0.35;
      tracks.forEach((tr, i) => {
        off[i] = (off[i] + speed) % widths[i];
        const x = i === 0 ? -off[i] : off[i] - widths[i];
        tr.style.transform = `translate3d(${x}px,0,0)`;
      });
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) { last = performance.now(); lastY = window.scrollY; raf = requestAnimationFrame(loop); }
    });
    io.observe(wrap.current);
    const onR = () => { widths = tracks.map((tr) => tr.scrollWidth / 2); };
    window.addEventListener('resize', onR);
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('resize', onR); };
  }, [lang]);
  const items = [...t.marquee, ...t.marquee];
  const Row = ({ outline }) => (
    <div className="mq-track">
      {[0, 1].map((k) => (
        <span key={k} className="flex shrink-0 items-center">
          {items.map((w, i) => (
            <span key={i} className={`mq-word font-display ${outline ? 'is-outline' : ''}`}>{w}<i aria-hidden="true">✦</i></span>
          ))}
        </span>
      ))}
    </div>
  );
  return (
    <div ref={wrap} className="marquee" aria-label={t.marquee.join(', ')}>
      <div className="mq-band band-a" aria-hidden="true"><Row /></div>
      <div className="mq-band band-b" aria-hidden="true"><Row outline /></div>
    </div>
  );
}
