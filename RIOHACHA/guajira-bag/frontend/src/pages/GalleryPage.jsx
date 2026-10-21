import { memo, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Seo from '../components/Seo';
import Img from '../components/Img';
import { getGaleria } from '../api';
import { useSnapTrack } from '../hooks/useSnapTrack';

let cacheGaleria = null;

/** Hace que una fila se pueda arrastrar con el mouse (en celular ya se desliza con el dedo). */
function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let down = null;
    let moved = 0;
    const onDown = (e) => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = { x: e.clientX, left: el.scrollLeft }; moved = 0; };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6) { el.classList.add('drag'); el.scrollLeft = down.left - dx; }
    };
    const onUp = () => { down = null; el.classList.remove('drag'); };
    const onClick = (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick, true);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClick, true);
    };
  }, [ref]);
}

const Hanging = memo(function Hanging({ img, n, onOpen }) {
  return (
    <figure className="hang" style={{ '--t': `${((n * 37) % 7) - 3}deg`, '--s': `${5 + (n % 4)}s`, '--dl': `${-(n % 5) * 0.7}s` }}>
      <span className="hang__peg" aria-hidden="true" />
      <button type="button" className="hang__photo" onClick={() => onOpen(n)} aria-label={img.caption ? `Ver foto: ${img.caption}` : 'Ver foto'}>
        <Img src={img.url} alt={img.caption || 'Foto de Guajira Bags'} w={480} widths={[320, 480, 640]} sizes="(max-width: 700px) 62vw, 300px" eager={n < 3} />
      </button>
      {img.caption && <figcaption>{img.caption}</figcaption>}
    </figure>
  );
});

function Line({ items, offset, onOpen, label }) {
  const ref = useRef(null);
  useDragScroll(ref);
  const step = (dir) => {
    const el = ref.current;
    if (!el) return;
    const w = el.querySelector('.hang')?.offsetWidth || 300;
    el.style.scrollSnapType = 'none';
    el.scrollTo({ left: el.scrollLeft + dir * w * Math.max(1, Math.floor(el.clientWidth / w) - 1), behavior: 'smooth' });
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.scrollSnapType = ''; }, 700);
  };
  return (
    <div className="line">
      <div ref={ref} className="line__scroll" aria-label={label}>
        <div className="line__rope" style={{ '--n': items.length }}>
          {items.map(({ img, n }) => <Hanging key={img.id ?? n} img={img} n={n} onOpen={onOpen} />)}
        </div>
      </div>
      <button type="button" className="line__btn l" onClick={() => step(-1)} aria-label="Anterior"><ChevronLeft size={20} /></button>
      <button type="button" className="line__btn r" onClick={() => step(1)} aria-label="Siguiente"><ChevronRight size={20} /></button>
      {offset && <span className="sr">{offset}</span>}
    </div>
  );
}

function Viewer({ images, start, onClose }) {
  const [index, setIndex] = useState(start);
  const { ref, goTo, onScroll } = useSnapTrack(index, setIndex, images.length);
  useEffect(() => { goTo(start, false); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') goTo(index + 1); if (e.key === 'ArrowLeft') goTo(index - 1); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, goTo, onClose]);
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = ''; };
  }, []);
  return (
    <div className="viewer" role="dialog" aria-modal="true">
      <div ref={ref} className="viewer__track" onScroll={onScroll}>
        {images.map((img, k) => (
          <figure key={img.id ?? k} className="viewer__slide" onClick={(e) => e.target === e.currentTarget && onClose()}>
            {Math.abs(k - index) <= 1 && <Img src={img.url} alt={img.caption || ''} w={1280} widths={[640, 960, 1280]} sizes="100vw" eager={k === index} className="contain" />}
            {img.caption && <figcaption>{img.caption}</figcaption>}
          </figure>
        ))}
      </div>
      <span className="viewer__count">{index + 1} / {images.length}</span>
      <button type="button" className="viewer__btn close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
      {images.length > 1 && (
        <>
          <button type="button" className="viewer__btn l" onClick={() => goTo(index - 1)} aria-label="Anterior"><ChevronLeft size={24} /></button>
          <button type="button" className="viewer__btn r" onClick={() => goTo(index + 1)} aria-label="Siguiente"><ChevronRight size={24} /></button>
        </>
      )}
    </div>
  );
}

/**
 * Galería "Hilo de fotos": las fotos cuelgan de hilos con ganchos de madera, se mecen con suavidad
 * y se recorren deslizando (o arrastrando con el mouse). Al tocar una, se abre el visor a pantalla completa.
 */
export default function GalleryPage() {
  const [images, setImages] = useState(cacheGaleria || []);
  const [loading, setLoading] = useState(!cacheGaleria);
  const [openAt, setOpenAt] = useState(null);

  useEffect(() => {
    getGaleria(true)
      .then((d) => { const list = Array.isArray(d) ? d : []; cacheGaleria = list; setImages(list); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const indexed = images.map((img, n) => ({ img, n }));
  const rows = images.length > 6 ? [indexed.filter((_, k) => k % 2 === 0), indexed.filter((_, k) => k % 2 === 1)] : [indexed];

  return (
    <div className="gallery-page">
      <Seo
        path="/galeria"
        title="Galería — Artesanía Wayuu"
        description="Galería fotográfica de nuestras mochilas Wayuu y del proceso artesanal de tejido en La Guajira, Colombia."
        keywords="galería mochilas wayuu, fotos artesanía wayuu, tejido wayuu"
      />
      <div className="wrap gallery-page__head">
        <span className="eyebrow">Galería</span>
        <h1 className="h-display">Luz, <em>hilo</em> y color</h1>
        <p>Momentos colgados con cariño: el proceso artesanal detrás de cada mochila Wayuu y Kankuama. Desliza para recorrerlos.</p>
      </div>

      {loading ? (
        <div className="line"><div className="line__scroll"><div className="line__rope" style={{ '--n': 5 }}>
          {Array.from({ length: 5 }, (_, k) => <figure key={k} className="hang"><span className="hang__peg" /><span className="hang__photo"><span className="skel" /></span></figure>)}
        </div></div></div>
      ) : images.length === 0 ? (
        <p className="gallery-empty">Aún no hay fotos publicadas.</p>
      ) : (
        rows.map((r, k) => <Line key={k} items={r} onOpen={setOpenAt} label={`Fila ${k + 1} de fotos`} />)
      )}

      {openAt !== null && images[openAt] && <Viewer images={images} start={openAt} onClose={() => setOpenAt(null)} />}
    </div>
  );
}
