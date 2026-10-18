import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Seo from '../components/Seo';
import { getGaleria } from '../api';
import { toMediaUrl } from '../config';
import { useReveal } from '../hooks/useReveal';

function Lightbox({ images, index, onClose, onNav }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [onClose, onNav]);

  const img = images[index];
  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="lightbox__frame" onClick={(e) => e.stopPropagation()}>
        <img src={toMediaUrl(img.url)} alt={img.caption || ''} />
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        {images.length > 1 && (
          <>
            <button type="button" className="lightbox__arrow l" onClick={() => onNav(-1)} aria-label="Anterior"><ChevronLeft size={22} /></button>
            <button type="button" className="lightbox__arrow r" onClick={() => onNav(1)} aria-label="Siguiente"><ChevronRight size={22} /></button>
          </>
        )}
      </div>
    </div>
  );
}

function Tile({ img, i }) {
  const ref = useReveal({ index: i % 6 });
  return (
    <figure ref={ref} data-v="zoom" className="rv gmasonry__item" data-idx={i}>
      <img src={toMediaUrl(img.url)} alt={img.caption || ''} loading="lazy" decoding="async" />
      {img.caption && <figcaption className="gmasonry__cap">{img.caption}</figcaption>}
    </figure>
  );
}

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAt, setOpenAt] = useState(null);

  useEffect(() => {
    getGaleria(true)
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="gallery-page">
      <Seo
        path="/galeria"
        title="Galería — Artesanía Wayuu"
        description="Galería fotográfica de nuestras mochilas Wayuu y del proceso artesanal de tejido en La Guajira, Colombia."
        keywords="galería mochilas wayuu, fotos artesanía wayuu, tejido wayuu"
      />
      <div className="wrap">
        <div className="gallery-page__head">
          <span className="eyebrow">Galería</span>
          <h1 className="h-display">Luz, hilo y color</h1>
          <p>El proceso artesanal detrás de cada mochila Wayuu y Kankuama.</p>
        </div>

        {loading ? (
          <div className="gmasonry">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="gmasonry__item" style={{ height: 200 + (i % 3) * 60, position: 'relative' }}><span className="skel" /></div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <p className="gallery-empty">Aún no hay fotos publicadas.</p>
        ) : (
          <div className="gmasonry" onClick={(e) => {
            const el = e.target.closest('[data-idx]');
            if (el) setOpenAt(Number(el.dataset.idx));
          }}>
            {images.map((img, i) => <Tile key={img.id ?? i} img={img} i={i} />)}
          </div>
        )}
      </div>

      {openAt !== null && (
        <Lightbox
          images={images}
          index={openAt}
          onClose={() => setOpenAt(null)}
          onNav={(d) => setOpenAt((i) => (i + d + images.length) % images.length)}
        />
      )}
    </div>
  );
}
