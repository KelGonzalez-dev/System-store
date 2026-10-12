import { useEffect, useRef } from 'react';
import { ProductCard } from './Product';
import { PRODUCTS } from '../data';

const FAVS = PRODUCTS.filter((p) => p.fav);

// Carrusel horizontal: las tarjetas giran en 3D según su distancia al centro (se arrastra con el dedo)
export default function Favorites({ onOpen }) {
  const track = useRef(null);
  useEffect(() => {
    const el = track.current;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      for (const c of el.children) {
        const d = Math.max(-1, Math.min(1, (c.offsetLeft + c.offsetWidth / 2 - mid) / (el.clientWidth * 0.7)));
        c.style.transform = `perspective(1200px) rotateY(${(-d * 24).toFixed(1)}deg) translateZ(${(-Math.abs(d) * 80).toFixed(0)}px)`;
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    el.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    update();
    return () => { el.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  const nudge = (d) => track.current.scrollBy({ left: d * track.current.clientWidth * 0.6, behavior: 'smooth' });
  return (
    <section id="favoritos" className="fav-sec">
      <div className="wrap flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Lo más pedido</p>
          <h2 className="rv mask-up sec-title"><span>Favoritos de <em>Zulima</em></span></h2>
        </div>
        <div className="flex gap-2">
          <button type="button" className="round-btn" onClick={() => nudge(-1)} aria-label="Anteriores">←</button>
          <button type="button" className="round-btn" onClick={() => nudge(1)} aria-label="Siguientes">→</button>
        </div>
      </div>
      <div ref={track} className="fav-track no-scrollbar">
        {FAVS.map((p) => <div key={p.id} className="fav-slot"><ProductCard p={p} onOpen={onOpen} /></div>)}
      </div>
    </section>
  );
}
