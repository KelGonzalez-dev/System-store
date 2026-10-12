import { useEffect, useRef } from 'react';
import { CONFIG, FAME } from '../data';
import { reducedMotion } from '../lib/scroll';

/**
 * "Muro de la fama": una pared de fotos a oscuras; un reflector sigue tu mouse (o tu dedo) y las ilumina.
 * En celular, el reflector se pasea solo. Al entrar, destellos de cámara como en una alfombra roja.
 */
export default function Fame() {
  const sec = useRef(null);
  const wall = useRef(null);
  useEffect(() => {
    const el = wall.current;
    let raf = 0, tx = 0.5, ty = 0.4, cx = 0.5, cy = 0.4, auto = !window.matchMedia('(pointer: fine)').matches, t0 = performance.now(), visible = false;
    const reduce = reducedMotion();
    const tick = (now) => {
      if (auto && !reduce) { const t = (now - t0) / 1000; tx = 0.5 + Math.sin(t * 0.7) * 0.38; ty = 0.5 + Math.sin(t * 1.1 + 1) * 0.32; }
      cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
      el.style.setProperty('--sx', `${(cx * 100).toFixed(2)}%`); el.style.setProperty('--sy', `${(cy * 100).toFixed(2)}%`);
      if (visible) raf = requestAnimationFrame(tick);
    };
    const move = (e) => { const r = el.getBoundingClientRect(); auto = false; tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) { sec.current.classList.add('flash'); raf = requestAnimationFrame(tick); } });
    io.observe(el);
    el.addEventListener('pointermove', move, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); };
  }, []);
  return (
    <section id="fama" ref={sec} className="fame-sec">
      <div className="wrap py-[clamp(90px,11vw,140px)]">
        <div className="fame-head">
          <div>
            <p className="kicker">Celebridades · Don Juanes</p>
            <h2 className="rv mask-up sec-title"><span>Muro de la <span className="gold-text">fama</span></span></h2>
          </div>
          <p className="max-w-[40ch] text-white/65">Artistas, futbolistas, creadores y gente que marca tendencia se sientan en nuestras sillas. Mueve el reflector y descúbrelos.</p>
        </div>
        <div ref={wall} className="fame-wall">
          {FAME.map((src, i) => <figure key={src} className={`fw f${i}`}><img src={src} alt="" loading="lazy" decoding="async" /></figure>)}
          <div className="spot" aria-hidden="true" />
          <div className="flashes" aria-hidden="true">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
        </div>
        <div className="mt-8 flex justify-center">
          <a className="btn btn-glass" href={`https://www.instagram.com/${CONFIG.instagram}`} target="_blank" rel="noopener noreferrer">Ver más en @{CONFIG.instagram}</a>
        </div>
      </div>
    </section>
  );
}
