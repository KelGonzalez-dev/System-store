import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getGaleria } from '../api';
import Img from './Img';

/**
 * Inicio · "Carrusel de arcos": las fotos de la galería forman un anillo 3D que gira despacio.
 * Se puede arrastrar para girarlo (con inercia) y al tocar una foto se abre la galería.
 * Un solo elemento se transforma por cuadro y solo mientras está en pantalla.
 */
export default function GalleryPreview() {
  const [images, setImages] = useState([]);
  const [front, setFront] = useState(0);
  const stage = useRef(null);
  const ring = useRef(null);
  const nav = useNavigate();

  useEffect(() => {
    getGaleria(true).then((d) => setImages(Array.isArray(d) ? d.slice(0, 10) : [])).catch(() => {});
  }, []);

  const list = images.length && images.length < 7 ? [...images, ...images].slice(0, Math.max(7, images.length)) : images;
  const n = list.length;

  useEffect(() => {
    const el = stage.current;
    const r = ring.current;
    if (!el || !r || !n) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rot = 0;
    let vel = reduce ? 0 : -0.08;
    let drag = null;
    let raf = 0;
    let visible = false;
    let last = -1;
    let moved = 0;
    const step = 360 / n;
    const frame = () => {
      if (!drag) { rot += vel; vel += ((reduce ? 0 : -0.08) - vel) * 0.03; }
      r.style.transform = `translateZ(calc(var(--R) * -1)) rotateY(${rot}deg)`;
      const f = ((Math.round(-rot / step) % n) + n) % n;
      if (f !== last) { last = f; setFront(f); }
      if (visible) raf = requestAnimationFrame(frame);
    };
    const down = (e) => { drag = { x: e.clientX, rot }; moved = 0; el.setPointerCapture?.(e.pointerId); };
    const move = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      moved = Math.max(moved, Math.abs(dx));
      const nr = drag.rot + dx * 0.25;
      vel = (nr - rot) * 0.6;
      rot = nr;
    };
    const up = () => { drag = null; };
    const click = (e) => {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); return; }
      const card = e.target.closest('[data-k]');
      if (card) nav('/galeria');
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', click);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; cancelAnimationFrame(raf); if (visible) raf = requestAnimationFrame(frame); });
    io.observe(el);
    return () => {
      io.disconnect(); cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); el.removeEventListener('click', click);
    };
  }, [n, nav]);

  if (!n) return null;
  const cap = list[front]?.caption;

  return (
    <section className="gring">
      <div className="wrap gring__head">
        <div>
          <span className="eyebrow">Galería</span>
          <h2 className="h-display">Momentos <em>tejidos</em> a mano</h2>
        </div>
        <Link to="/galeria" className="btn btn--line btn--sm">Ver toda la galería</Link>
      </div>
      <div ref={stage} className="gring__stage" style={{ '--n': n }} aria-label="Fotos de la galería: arrastra para girar">
        <div ref={ring} className="gring__ring">
          {list.map((img, k) => (
            <figure key={`${img.id}-${k}`} data-k={k} className={`gring__card${k === front ? ' on' : ''}`} style={{ '--k': k }}>
              <Img src={img.url} alt={img.caption || 'Foto de Guajira Bags'} w={480} widths={[320, 480]} sizes="240px" />
            </figure>
          ))}
        </div>
        <span className="gring__floor" aria-hidden="true" />
      </div>
      <p className="gring__cap" key={front}>{cap || 'Arrastra para girar · toca una foto para ver la galería'}</p>
    </section>
  );
}
